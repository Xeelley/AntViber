import { EventEmitter } from 'events';
import * as Viber from 'viber-bot';
import * as AntTypes from './types';

import * as T from './t';

import { CommandParser } from '../utils/CommandParser';
import { Config }        from '../utils/ConfigBulder';
import * as RestAPI      from '../utils/RestAPI';


export class AntCore extends EventEmitter {

    protected $api: Viber.Bot;
    public Types: AntTypes.ITypes;

    private config: T.AntViberConfig;
    private connectionConfig: T.AntConnectionConfig;

    protected botListeners: T.Listeners = {};
    protected commands: T.Commands = {};


    constructor(authToken: string, name: string, avatar: string, config: T.AntViberConfig) {
        super();

        if (!config.getStatus) throw new Error('Ant: config.getStatus not provided! This field is mandatory.');
        if (!config.setStatus) throw new Error('Ant: config.setStatus not provided! This field is mandatory.');
        this.config = Config(config);
        RestAPI.setConfig(this.config);

        this.connectionConfig = { token: authToken, name, avatar };

        this.$api = new Viber.Bot({ authToken, name, avatar });

        this.Types = {
            ReplyKeyboardButton: this._ReplyKeyboardButton.bind(this),
            RichKeyboardButton:  this._RichKeyboardButton.bind(this),
            UrlKeyboardButton:   this._UrlKeyboardButton.bind(this),
            ImageKeyboardButton: this._ImageKeyboardButton.bind(this),
            ShareLocationButton: this._ShareLocationButton.bind(this),
            SharePhoneButton:    this._SharePhoneButton.bind(this),
            TextMessage:         this._TextMessage.bind(this),
            Keyboard:            this._Keyboard.bind(this),
            RichMedia:           this._RichMedia.bind(this),
            Picture:             this._Picture.bind(this),
            Url:                 this._Url.bind(this),
            Contact:             this._Contact.bind(this),
            Video:               this._Video.bind(this),
            Location:            this._Location.bind(this),
            Sticker:             this._Sticker.bind(this),
            File:                this._File.bind(this),
        };

        this.init();
    }

    public command(command: string, method: T.CommandCallback) {
        this.commands[command] = method;
    }

    public status(id: string, status: string): Promise<any> {
        return this.config.setStatus(id, status);
    }

    public on(event: T.AntViberEvent, listener: (...args: any[]) => void): any {
        super.on(event, listener);
    }

    public emit(event: T.AntViberEvent, ...args: any[]): any {
        super.emit(event, args);
    }


    private init() {
        this.addListeners();
        this.addBasicListeners();
    }

    private addListeners() {
        this.$api.on(Viber.Events.MESSAGE_RECEIVED, (message: T.ViberMessage, response: T.ViberResponse) => {
            const text   = message.text || '';
            const user   = response.userProfile;
            const prefix = this.config.richPayloadPrefix;
           
            if (message.url && message.thumbnail) {
                const data: T.Message = {
                    picture: {
                        url: message.url,
                        thumbnail: message.thumbnail,
                        caption: message.text,
                    },
                    userProfile: user,
                }   
                this.emit('picture', data);
            } else if (message.url && message.filename && message.sizeInBytes) {
                const data: T.Message = {
                    file: {   
                        url:      message.url,
                        filename: message.filename,
                        size:     message.sizeInBytes,
                    },
                    userProfile: user,
                }
                this.emit('file', data);
            } else if (message.latitude && message.longitude) {
                const data: T.Message = {
                    location: {
                        longitude: message.longitude,
                        latitude:  message.latitude,
                    },
                    userProfile: user,
                }
                this.emit('location', data);
            } else if (message.contactName || message.contactPhoneNumber) {
                const data: T.Message = {
                    contact: {
                        name:   message.contactName,
                        phone:  message.contactPhoneNumber,
                        avatar: message.contactAvatar,
                    },
                    userProfile: user,
                }
                this.emit('contact', data);
            } else if (message.stickerId) {
                const data: T.Message = {
                    stickerId: message.stickerId,
                    userProfile: user,
                }
                this.emit('sticker', data);
            } else if (text.slice(0, prefix.length) === prefix) {
                const payload: T.Message = {
                    payloadData: text.slice(prefix.length),
                    userProfile: user,
                }
                let command = payload.payloadData.slice(0, payload.payloadData.indexOf(this.config.richPayloadDataSeparator));
                command = command.indexOf('?') !== -1 ? command.slice(0, command.indexOf('?')) : command;

                if (Object.keys(this.commands).includes(command)) {
                    this.commands[command](user, CommandParser.parse(text), message);
                    return;
                } else {  
                    this.emit('rich_payload', payload);
                }
            } else {
                const command = text.indexOf('?') !== -1 ?
                text.slice(0, text.indexOf('?')) : text;
    
                if (Object.keys(this.commands).includes(command)) {
                    this.commands[command](user, CommandParser.parse(text), message);
                    return;
                } else {
                    const data: T.Message = {
                        text,
                        userProfile: user,
                    }
                    this.emit('message', data);
                }
            }
        })

        if (this.config.autoStartMessage) {
            this.$api.onConversationStarted((_: T.ViberUserProfile, __: boolean, c: any, onFinish: Function) => {
                const keyboard = this.Types.RichMedia([
                    this.Types.RichKeyboardButton(this.config.startButtonText, '/start', 
                    '/start' + (c ? '?context=' + c : ''))
                ], 1);
                onFinish(keyboard);
            })
        }

        this.$api.on(Viber.Events.ERROR, (err: Error) => {
            this.emit('error', err);
            this.emit('Error', err);
        })
        this.$api.on(Viber.Events.MESSAGE_SENT, (message: T.ViberMessage, userProfile: T.ViberUserProfile) => {
            const text = message.text || '';
            const data: T.Message = {
                text,
                userProfile,
            }
            this.emit('message_sent', data);
        })
        this.$api.on(Viber.Events.SUBSCRIBED, (response: T.ViberResponse) => {
            const user = response.userProfile;
            const data: T.Message = {
                userProfile: user,
            }
            this.emit('subscribed', data);
        })
        this.$api.on(Viber.Events.UNSUBSCRIBED, (response: T.ViberResponse) => {
            const user = response.userProfile;
            const data: T.Message = {
                userProfile: user,
            }
            this.emit('unsubscribed', data);
        })
    }

    // TYPES

    private _ReplyKeyboardButton(text: string, columns: number = 6, rows: number = 1): AntTypes.IButton {
        return {
            ActionType: 'reply',
            ActionBody: text,
            Text: text,
            Columns: columns,
            Rows: rows,
            BgColor: this.config.keyboardSettings.buttonColor,
        }
    }
    private _RichKeyboardButton(text: string, status: string, data: string, columns: number = 6, rows: number = 1): AntTypes.IButton {
        return {
            ActionType: 'reply',
            ActionBody: this.config.richPayloadPrefix + status + this.config.richPayloadDataSeparator + data,
            Text: text,
            Columns: columns,
            Rows: rows,
            BgColor: this.config.keyboardSettings.buttonColor,
        }
    }
    private _UrlKeyboardButton(text: string, url: string, columns: number = 6, rows: number = 1): AntTypes.IButton {
        return {
            ActionType: 'open-url',
            ActionBody: url,
            Text: text,
            Columns: columns,
            Rows: rows,
            BgColor: this.config.keyboardSettings.buttonColor,
        }
    }
    private _ImageKeyboardButton(imageUrl: string, type: 'open-url' | 'reply', payload: string, columns: number = 6, rows: number = 1): AntTypes.IButton {
        return {
            ActionType: type,
            ActionBody: payload,
            Columns: columns,
            Rows: rows,
            BgColor: this.config.keyboardSettings.buttonColor,
            Image: imageUrl,
        }
    }
    private _ShareLocationButton(text: string, columns: number = 6, rows: number = 1): AntTypes.IButton {
        return {
            ActionType: 'location-picker',
            ActionBody: text,
            Text: text,
            Columns: columns,
            Rows: rows,
            BgColor: this.config.keyboardSettings.buttonColor,
        }
    }
    private _SharePhoneButton(text: string, columns: number = 6, rows: number = 1): AntTypes.IButton {
        return {
            ActionType: 'share-phone',
            ActionBody: text,
            Text: text,
            Columns: columns,
            Rows: rows,
            BgColor: this.config.keyboardSettings.buttonColor,
        }
    }
    private _AnyKeyboard(buttons: AntTypes.IButton[], rows?: number): AntTypes.IKeyboard {
        const keyboard: AntTypes.IKeyboard = {
            Type: 'keyboard',
            Revision: 1,
            BgColor: this.config.keyboardSettings.backgroundColor,
            Buttons: buttons,
        }
        if (rows) keyboard.ButtonsGroupRows = rows;
        return keyboard;
    }
    private _Keyboard(buttons: AntTypes.IButton[]): Viber.Message.Keyboard {
        return new Viber.Message.Keyboard(this._AnyKeyboard(buttons), null, null, null, 3);
    }
    private _RichMedia(buttons: AntTypes.IButton[], rows: number): Viber.Message.RichMedia {
        return new Viber.Message.RichMedia(this._AnyKeyboard(buttons, rows), null, null, null, 3);
    }
    private _TextMessage(text: string): Viber.Message.Text {
        return new Viber.Message.Text(text);
    }
    private _Picture(url: string, caption?: string, thumbnail?: string): Viber.Message.Picture {
        return new Viber.Message.Picture(url, caption, thumbnail);
    }
    private _Url(url: string): Viber.Message.Url {
        return new Viber.Message.Url(url);
    }
    private _Contact(name: string, phone: string, avatar?: string): Viber.Message.Contact {
        return new Viber.Message.Contact(name, phone, avatar);
    }
    private _Video(url: string, size: string, caption?: string, thumbnail?: string, duration?: number): Viber.Message.Video {
        return new Viber.Message.Video(url, size, caption, thumbnail, duration);
    }
    private _Location(latitude: number, longitude: number): Viber.Message.Location {
        return new Viber.Message.Location(latitude, longitude);
    }
    private _Sticker(stickerId: number): Viber.Message.Sticker {
        return new Viber.Message.Sticker(stickerId);
    }
    private _File(url: string, size: number, filename: string): Viber.Message.File {
        return new Viber.Message.File(url, size, filename);
    }

    public sendMessage(user: T.ViberUserProfile | string, messages: AntTypes.MessageType[]): Promise<RestAPI.APIResponse[]> {
        return new Promise<RestAPI.APIResponse[]>((resolve, reject) => {
            RestAPI.sendMessage(user, messages, this.connectionConfig).then(resolve).catch(reject)
        })
    }

    private addBasicListeners() {
        [ 'subscribed', 'unsubscribed' ].forEach((type: T.AntViberEvent) => {
            this.on(type, (messages: T.Message[]) => {
                const message = messages[0];
                const user = message.userProfile;
                this.checkStatus(user, type);
            })
        }, this);
        [ 'message', 'message_sent' ].forEach((type: T.AntViberEvent) => {
            this.on(type, (messages: T.Message[]) => {
                const message = messages[0];
                const user = message.userProfile;
                this.checkStatus(user, type, message.text);
            })
        }, this);
        [ 'rich_payload' ].forEach((type: T.AntViberEvent) => {
            this.on(type, (messages: T.Message[]) => {
                const message = messages[0];
                const user = message.userProfile;
                this.checkStatus(user, type, message.payloadData);
            })
        }, this);
        [ 'picture' ].forEach((type: T.AntViberEvent) => {
            this.on(type, (messages: T.Message[]) => {
                const message = messages[0];
                const user = message.userProfile;
                this.checkStatus(user, type, message.picture);
            })
        }, this);
        [ 'sticker' ].forEach((type: T.AntViberEvent) => {
            this.on(type, (messages: T.Message[]) => {
                const message = messages[0];
                const user = message.userProfile;
                this.checkStatus(user, type, message.stickerId);
            })
        }, this);
        [ 'file' ].forEach((type: T.AntViberEvent) => {
            this.on(type, (messages: T.Message[]) => {
                const message = messages[0];
                const user = message.userProfile;
                this.checkStatus(user, type, message.file);
            })
        }, this);
        [ 'location' ].forEach((type: T.AntViberEvent) => {
            this.on(type, (messages: T.Message[]) => {
                const message = messages[0];
                const user = message.userProfile;
                this.checkStatus(user, type, message.location);
            })
        }, this);
        [ 'contact' ].forEach((type: T.AntViberEvent) => {
            this.on(type, (messages: T.Message[]) => {
                const message = messages[0];
                const user = message.userProfile;
                this.checkStatus(user, type, message.contact);
            })
        }, this);
    }

    private checkStatus(user: T.ViberUserProfile, type: T.AntViberEvent, data?: any, extra?: any) {
        if (!user || !user.id) return;
        this.config.getStatus(user.id)
        .then(status => {
            if ([ 'rich_payload' ].includes(type)) {
                const richStatus = data.slice(0, data.indexOf(this.config.richPayloadDataSeparator));
                const payload    = data.slice(data.indexOf(this.config.richPayloadDataSeparator) 
                                 + this.config.richPayloadDataSeparator.length);
                
                // start

                if (Object.keys(this.botListeners[type]).includes(richStatus)) {
                    return this.botListeners[type][richStatus](user, payload, extra);
                } else {
                    for (let i in Object.keys(this.botListeners[type])) {
                        const listener = Object.keys(this.botListeners[type])[i];
                        if (this.isMask(listener) && this.isMatch(richStatus, listener)) {
                            return this.botListeners[type][listener](user, payload, this.isMatch(richStatus, listener));
                        }
                    }
                }
            } else {
                if (!status) return;
                this.botListeners[type] = this.botListeners[type] || {}; 

                if (Object.keys(this.botListeners[type]).includes(status)) {
                    return this.botListeners[type][status](user, data, extra);
                } else {
                    for (let i in Object.keys(this.botListeners[type])) {
                        const listener = Object.keys(this.botListeners[type])[i];
                        if (this.isMask(listener) && this.isMatch(status, listener)) {
                            return this.botListeners[type][listener](user, data, this.isMatch(status, listener));
                        }
                    }
                }
            }
        })
        .catch((err: Error) => this.onError(user.id, err));
    }

    private onError(id: string, err: Error) {
        this.emit('Error', Object.assign(err, { user_id: id }));
    }

    private isMask(mask: String): Boolean {
        return mask.split(this.config.maskSeparator).includes('*');
    }

    private isMatch(status: String, mask: String) {
        if (mask === '*') return status;

        const statusLevels = status.split(this.config.maskSeparator);
        const maskLevels   = mask.split(this.config.maskSeparator);
        let   maskMatch;
        if (maskLevels.length !== statusLevels.length) {
            return null;
        }
        for (let i = 0; i < maskLevels.length; i++) {
            if (maskLevels[i] !== '*') {
                if (maskLevels[i] !== statusLevels[i]) {
                    return null;
                }
            } else {
                maskMatch = statusLevels[i];
            }
        }
        return maskMatch;
    }

    public setWebhook(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.$api.setWebhook(url).then(resolve).catch(reject);
        });
    }

    public middleware() {
        return this.$api.middleware();
    }
}
