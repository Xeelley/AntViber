"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const Viber = require("viber-bot");
const CommandParser_1 = require("../utils/CommandParser");
const ConfigBulder_1 = require("../utils/ConfigBulder");
const RestAPI = require("../utils/RestAPI");
class AntCore extends events_1.EventEmitter {
    constructor(authToken, name, avatar, config) {
        super();
        this.botListeners = {};
        this.commands = {};
        if (!config.getStatus)
            throw new Error('Ant: config.getStatus not provided! This field is mandatory.');
        if (!config.setStatus)
            throw new Error('Ant: config.setStatus not provided! This field is mandatory.');
        this.config = ConfigBulder_1.Config(config);
        RestAPI.setConfig(this.config);
        this.connectionConfig = { token: authToken, name, avatar };
        this.$api = new Viber.Bot({ authToken, name, avatar });
        this.Types = {
            ReplyKeyboardButton: this._ReplyKeyboardButton.bind(this),
            RichKeyboardButton: this._RichKeyboardButton.bind(this),
            UrlKeyboardButton: this._UrlKeyboardButton.bind(this),
            ShareLocationButton: this._ShareLocationButton.bind(this),
            SharePhoneButton: this._SharePhoneButton.bind(this),
            TextMessage: this._TextMessage.bind(this),
            Keyboard: this._Keyboard.bind(this),
            RichMedia: this._RichMedia.bind(this),
            Picture: this._Picture.bind(this),
            Url: this._Url.bind(this),
            Contact: this._Contact.bind(this),
            Video: this._Video.bind(this),
            Location: this._Location.bind(this),
            Sticker: this._Sticker.bind(this),
            File: this._File.bind(this),
        };
        this.init();
    }
    command(command, method) {
        this.commands[command] = method;
    }
    status(id, status) {
        return this.config.setStatus(id, status);
    }
    on(event, listener) {
        super.on(event, listener);
    }
    emit(event, ...args) {
        super.emit(event, args);
    }
    init() {
        this.addListeners();
        this.addBasicListeners();
    }
    addListeners() {
        this.$api.on(Viber.Events.MESSAGE_RECEIVED, (message, response) => {
            const text = message.text || '';
            const user = response.userProfile;
            const prefix = this.config.richPayloadPrefix;
            if (message.url && message.thumbnail) {
                const data = {
                    picture: {
                        url: message.url,
                        thumbnail: message.thumbnail,
                        caption: message.text,
                    },
                    userProfile: user,
                };
                this.emit('picture', data);
            }
            else if (message.url && message.filename && message.sizeInBytes) {
                const data = {
                    file: {
                        url: message.url,
                        filename: message.filename,
                        size: message.sizeInBytes,
                    },
                    userProfile: user,
                };
                this.emit('file', data);
            }
            else if (message.latitude && message.longitude) {
                const data = {
                    location: {
                        longitude: message.longitude,
                        latitude: message.latitude,
                    },
                    userProfile: user,
                };
                this.emit('location', data);
            }
            else if (message.contactName || message.contactPhoneNumber) {
                const data = {
                    contact: {
                        name: message.contactName,
                        phone: message.contactPhoneNumber,
                        avatar: message.contactAvatar,
                    },
                    userProfile: user,
                };
                this.emit('contact', data);
            }
            else if (message.stickerId) {
                const data = {
                    stickerId: message.stickerId,
                    userProfile: user,
                };
                this.emit('sticker', data);
            }
            else if (text.slice(0, prefix.length) === prefix) {
                const payload = {
                    payloadData: text.slice(prefix.length),
                    userProfile: user,
                };
                let command = payload.payloadData.slice(0, payload.payloadData.indexOf(this.config.richPayloadDataSeparator));
                command = command.indexOf('?') !== -1 ? command.slice(0, command.indexOf('?')) : command;
                if (Object.keys(this.commands).includes(command)) {
                    this.commands[command](user, CommandParser_1.CommandParser.parse(text), message);
                    return;
                }
                else {
                    this.emit('rich_payload', payload);
                }
            }
            else {
                const command = text.indexOf('?') !== -1 ?
                    text.slice(0, text.indexOf('?')) : text;
                if (Object.keys(this.commands).includes(command)) {
                    this.commands[command](user, CommandParser_1.CommandParser.parse(text), message);
                    return;
                }
                else {
                    const data = {
                        text,
                        userProfile: user,
                    };
                    this.emit('message', data);
                }
            }
        });
        if (this.config.autoStartMessage) {
            this.$api.onConversationStarted((_, __, c, onFinish) => {
                const keyboard = this.Types.RichMedia([
                    this.Types.RichKeyboardButton(this.config.startButtonText, '/start', '/start' + (c ? '?context=' + c : ''))
                ], 1);
                onFinish(keyboard);
            });
        }
        this.$api.on(Viber.Events.ERROR, (err) => {
            this.emit('error', err);
            this.emit('Error', err);
        });
        this.$api.on(Viber.Events.MESSAGE_SENT, (message, userProfile) => {
            const text = message.text || '';
            const data = {
                text,
                userProfile,
            };
            this.emit('message_sent', data);
        });
        this.$api.on(Viber.Events.SUBSCRIBED, (response) => {
            const user = response.userProfile;
            const data = {
                userProfile: user,
            };
            this.emit('subscribed', data);
        });
        this.$api.on(Viber.Events.UNSUBSCRIBED, (response) => {
            const user = response.userProfile;
            const data = {
                userProfile: user,
            };
            this.emit('unsubscribed', data);
        });
    }
    _ReplyKeyboardButton(text, columns = 6, rows = 1) {
        return {
            ActionType: 'reply',
            ActionBody: text,
            Text: text,
            Columns: columns,
            Rows: rows,
            BgColor: this.config.keyboardSettings.buttonColor,
        };
    }
    _RichKeyboardButton(text, status, data, columns = 6, rows = 1) {
        return {
            ActionType: 'reply',
            ActionBody: this.config.richPayloadPrefix + status + this.config.richPayloadDataSeparator + data,
            Text: text,
            Columns: columns,
            Rows: rows,
            BgColor: this.config.keyboardSettings.buttonColor,
        };
    }
    _UrlKeyboardButton(text, url, columns = 6, rows = 1) {
        return {
            ActionType: 'open-url',
            ActionBody: url,
            Text: text,
            Columns: columns,
            Rows: rows,
            BgColor: this.config.keyboardSettings.buttonColor,
        };
    }
    _ShareLocationButton(text, columns = 6, rows = 1) {
        return {
            ActionType: 'location-picker',
            ActionBody: text,
            Text: text,
            Columns: columns,
            Rows: rows,
            BgColor: this.config.keyboardSettings.buttonColor,
        };
    }
    _SharePhoneButton(text, columns = 6, rows = 1) {
        return {
            ActionType: 'share-phone',
            ActionBody: text,
            Text: text,
            Columns: columns,
            Rows: rows,
            BgColor: this.config.keyboardSettings.buttonColor,
        };
    }
    _AnyKeyboard(buttons, rows) {
        const keyboard = {
            Type: 'keyboard',
            Revision: 1,
            BgColor: this.config.keyboardSettings.backgroundColor,
            Buttons: buttons,
        };
        if (rows)
            keyboard.ButtonsGroupRows = rows;
        return keyboard;
    }
    _Keyboard(buttons) {
        return new Viber.Message.Keyboard(this._AnyKeyboard(buttons), null, null, null, 3);
    }
    _RichMedia(buttons, rows) {
        return new Viber.Message.RichMedia(this._AnyKeyboard(buttons, rows), null, null, null, 3);
    }
    _TextMessage(text) {
        return new Viber.Message.Text(text);
    }
    _Picture(url, caption, thumbnail) {
        return new Viber.Message.Picture(url, caption, thumbnail);
    }
    _Url(url) {
        return new Viber.Message.Url(url);
    }
    _Contact(name, phone, avatar) {
        return new Viber.Message.Contact(name, phone, avatar);
    }
    _Video(url, size, caption, thumbnail, duration) {
        return new Viber.Message.Video(url, size, caption, thumbnail, duration);
    }
    _Location(latitude, longitude) {
        return new Viber.Message.Location(latitude, longitude);
    }
    _Sticker(stickerId) {
        return new Viber.Message.Sticker(stickerId);
    }
    _File(url, size, filename) {
        return new Viber.Message.File(url, size, filename);
    }
    sendMessage(user, messages) {
        return new Promise((resolve, reject) => {
            RestAPI.sendMessage(user, messages, this.connectionConfig).then(resolve).catch(reject);
        });
    }
    addBasicListeners() {
        ['subscribed', 'unsubscribed'].forEach((type) => {
            this.on(type, (messages) => {
                const message = messages[0];
                const user = message.userProfile;
                this.checkStatus(user, type);
            });
        }, this);
        ['message', 'message_sent'].forEach((type) => {
            this.on(type, (messages) => {
                const message = messages[0];
                const user = message.userProfile;
                this.checkStatus(user, type, message.text);
            });
        }, this);
        ['rich_payload'].forEach((type) => {
            this.on(type, (messages) => {
                const message = messages[0];
                const user = message.userProfile;
                this.checkStatus(user, type, message.payloadData);
            });
        }, this);
        ['picture'].forEach((type) => {
            this.on(type, (messages) => {
                const message = messages[0];
                const user = message.userProfile;
                this.checkStatus(user, type, message.picture);
            });
        }, this);
        ['sticker'].forEach((type) => {
            this.on(type, (messages) => {
                const message = messages[0];
                const user = message.userProfile;
                this.checkStatus(user, type, message.stickerId);
            });
        }, this);
        ['file'].forEach((type) => {
            this.on(type, (messages) => {
                const message = messages[0];
                const user = message.userProfile;
                this.checkStatus(user, type, message.file);
            });
        }, this);
        ['location'].forEach((type) => {
            this.on(type, (messages) => {
                const message = messages[0];
                const user = message.userProfile;
                this.checkStatus(user, type, message.location);
            });
        }, this);
        ['contact'].forEach((type) => {
            this.on(type, (messages) => {
                const message = messages[0];
                const user = message.userProfile;
                this.checkStatus(user, type, message.contact);
            });
        }, this);
    }
    checkStatus(user, type, data, extra) {
        if (!user || !user.id)
            return;
        this.config.getStatus(user.id)
            .then(status => {
            if (['rich_payload'].includes(type)) {
                const richStatus = data.slice(0, data.indexOf(this.config.richPayloadDataSeparator));
                const payload = data.slice(data.indexOf(this.config.richPayloadDataSeparator)
                    + this.config.richPayloadDataSeparator.length);
                if (Object.keys(this.botListeners[type]).includes(richStatus)) {
                    return this.botListeners[type][richStatus](user, payload, extra);
                }
                else {
                    for (let i in Object.keys(this.botListeners[type])) {
                        const listener = Object.keys(this.botListeners[type])[i];
                        if (this.isMask(listener) && this.isMatch(richStatus, listener)) {
                            return this.botListeners[type][listener](user, payload, this.isMatch(richStatus, listener));
                        }
                    }
                }
            }
            else {
                if (!status)
                    return;
                this.botListeners[type] = this.botListeners[type] || {};
                if (Object.keys(this.botListeners[type]).includes(status)) {
                    return this.botListeners[type][status](user, data, extra);
                }
                else {
                    for (let i in Object.keys(this.botListeners[type])) {
                        const listener = Object.keys(this.botListeners[type])[i];
                        if (this.isMask(listener) && this.isMatch(status, listener)) {
                            return this.botListeners[type][listener](user, data, this.isMatch(status, listener));
                        }
                    }
                }
            }
        })
            .catch((err) => this.onError(user.id, err));
    }
    onError(id, err) {
        this.emit('Error', Object.assign(err, { user_id: id }));
    }
    isMask(mask) {
        return mask.split(this.config.maskSeparator).includes('*');
    }
    isMatch(status, mask) {
        if (mask === '*')
            return status;
        const statusLevels = status.split(this.config.maskSeparator);
        const maskLevels = mask.split(this.config.maskSeparator);
        let maskMatch;
        if (maskLevels.length !== statusLevels.length) {
            return null;
        }
        for (let i = 0; i < maskLevels.length; i++) {
            if (maskLevels[i] !== '*') {
                if (maskLevels[i] !== statusLevels[i]) {
                    return null;
                }
            }
            else {
                maskMatch = statusLevels[i];
            }
        }
        return maskMatch;
    }
    setWebhook(url) {
        return new Promise((resolve, reject) => {
            this.$api.setWebhook(url).then(resolve).catch(reject);
        });
    }
    middleware() {
        return this.$api.middleware();
    }
}
exports.AntCore = AntCore;
