"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var Viber = require("viber-bot");
var CommandParser_1 = require("../utils/CommandParser");
var ConfigBulder_1 = require("../utils/ConfigBulder");
var AntCore = (function (_super) {
    __extends(AntCore, _super);
    function AntCore(authToken, name, avatar, config) {
        var _this = _super.call(this) || this;
        _this.botListeners = {};
        _this.commands = {};
        if (!config.getStatus)
            throw new Error('Ant: config.getStatus not provided! This field is mandatory.');
        if (!config.setStatus)
            throw new Error('Ant: config.setStatus not provided! This field is mandatory.');
        _this.config = ConfigBulder_1.Config(config);
        _this.$api = new Viber.Bot({ authToken: authToken, name: name, avatar: avatar });
        _this.Types = {
            ReplyKeyboardButton: _this._ReplyKeyboardButton.bind(_this),
            RichKeyboardButton: _this._RichKeyboardButton.bind(_this),
            UrlKeyboardButton: _this._UrlKeyboardButton.bind(_this),
            ShareLocationButton: _this._ShareLocationButton.bind(_this),
            SharePhoneButton: _this._SharePhoneButton.bind(_this),
            TextMessage: _this._TextMessage.bind(_this),
            Keyboard: _this._Keyboard.bind(_this),
            RichMedia: _this._RichMedia.bind(_this),
            Picture: _this._Picture.bind(_this),
            Url: _this._Url.bind(_this),
            Contact: _this._Contact.bind(_this),
            Video: _this._Video.bind(_this),
            Location: _this._Location.bind(_this),
            Sticker: _this._Sticker.bind(_this),
            File: _this._File.bind(_this),
        };
        _this.init();
        return _this;
    }
    AntCore.prototype.command = function (command, method) {
        this.commands[command] = method;
    };
    AntCore.prototype.status = function (user, status) {
        return this.config.setStatus(user, status);
    };
    AntCore.prototype.on = function (event, listener) {
        _super.prototype.on.call(this, event, listener);
    };
    AntCore.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        _super.prototype.emit.call(this, event, args);
    };
    AntCore.prototype.init = function () {
        this.addListeners();
        this.addBasicListeners();
    };
    AntCore.prototype.addListeners = function () {
        var _this = this;
        this.$api.on(Viber.Events.MESSAGE_RECEIVED, function (message, response) {
            var text = message.text || '';
            var user = response.userProfile;
            var prefix = _this.config.richPayloadPrefix;
            if (message.url && message.thumbnail) {
                var data = {
                    picture: {
                        url: message.url,
                        thumbnail: message.thumbnail,
                        caption: message.text,
                    },
                    userProfile: user,
                };
                _this.emit('picture', data);
            }
            else if (message.url && message.filename && message.sizeInBytes) {
                var data = {
                    file: {
                        url: message.url,
                        filename: message.filename,
                        size: message.sizeInBytes,
                    },
                    userProfile: user,
                };
                _this.emit('file', data);
            }
            else if (message.latitude && message.longitude) {
                var data = {
                    location: {
                        longitude: message.longitude,
                        latitude: message.latitude,
                    },
                    userProfile: user,
                };
                _this.emit('location', data);
            }
            else if (message.contactName || message.contactPhoneNumber) {
                var data = {
                    contact: {
                        name: message.contactName,
                        phone: message.contactPhoneNumber,
                        avatar: message.contactAvatar,
                    },
                    userProfile: user,
                };
                _this.emit('contact', data);
            }
            else if (message.stickerId) {
                var data = {
                    stickerId: message.stickerId,
                    userProfile: user,
                };
                _this.emit('sticker', data);
            }
            else if (text.slice(0, prefix.length) === prefix) {
                var payload = {
                    payloadData: text.slice(prefix.length),
                    userProfile: user,
                };
                var command = payload.payloadData.slice(0, payload.payloadData.indexOf(_this.config.richPayloadDataSeparator));
                command = command.indexOf('?') !== -1 ? command.slice(0, command.indexOf('?')) : command;
                if (Object.keys(_this.commands).includes(command)) {
                    _this.commands[command](user.id, CommandParser_1.CommandParser.parse(text), user, message);
                    return;
                }
                else {
                    _this.emit('rich_payload', payload);
                }
            }
            else {
                var command = text.indexOf('?') !== -1 ?
                    text.slice(0, text.indexOf('?')) : text;
                if (Object.keys(_this.commands).includes(command)) {
                    _this.commands[command](user.id, CommandParser_1.CommandParser.parse(text), user, message);
                    return;
                }
                else {
                    var data = {
                        text: text,
                        userProfile: user,
                    };
                    _this.emit('message', data);
                }
            }
        });
        this.$api.onConversationStarted(function (userProfile, isSubscribed, context, onFinish) {
            var keyboard = _this.Types.RichMedia([
                _this.Types.RichKeyboardButton(_this.config.startButtonText, '/start', '/start')
            ]);
            onFinish(keyboard);
        });
        this.$api.on(Viber.Events.ERROR, function (err) {
            _this.emit('error', err);
            _this.emit('Error', err);
        });
        this.$api.on(Viber.Events.MESSAGE_SENT, function (message, userProfile) {
            var text = message.text || '';
            var data = {
                text: text,
                userProfile: userProfile,
            };
            _this.emit('message_sent', data);
        });
        this.$api.on(Viber.Events.SUBSCRIBED, function (response) {
            var user = response.userProfile;
            var data = {
                userProfile: user,
            };
            _this.emit('subscribed', data);
        });
        this.$api.on(Viber.Events.UNSUBSCRIBED, function (response) {
            var user = response.userProfile;
            var data = {
                userProfile: user,
            };
            _this.emit('unsubscribed', data);
        });
    };
    AntCore.prototype._ReplyKeyboardButton = function (text, columns, rows) {
        if (columns === void 0) { columns = 6; }
        if (rows === void 0) { rows = 1; }
        return {
            ActionType: 'reply',
            ActionBody: text,
            Text: text,
            Columns: columns,
            Rows: rows,
            BgColor: this.config.keyboardSettings.buttonColor,
        };
    };
    AntCore.prototype._RichKeyboardButton = function (text, status, data, columns, rows) {
        if (columns === void 0) { columns = 6; }
        if (rows === void 0) { rows = 1; }
        return {
            ActionType: 'reply',
            ActionBody: this.config.richPayloadPrefix + status + this.config.richPayloadDataSeparator + data,
            Text: text,
            Columns: columns,
            Rows: rows,
            BgColor: this.config.keyboardSettings.buttonColor,
        };
    };
    AntCore.prototype._UrlKeyboardButton = function (text, url, columns, rows) {
        if (columns === void 0) { columns = 6; }
        if (rows === void 0) { rows = 1; }
        return {
            ActionType: 'open-url',
            ActionBody: url,
            Text: text,
            Columns: columns,
            Rows: rows,
            BgColor: this.config.keyboardSettings.buttonColor,
        };
    };
    AntCore.prototype._ShareLocationButton = function (text, columns, rows) {
        if (columns === void 0) { columns = 6; }
        if (rows === void 0) { rows = 1; }
        return {
            ActionType: 'location-picker',
            ActionBody: text,
            Text: text,
            Columns: columns,
            Rows: rows,
            BgColor: this.config.keyboardSettings.buttonColor,
        };
    };
    AntCore.prototype._SharePhoneButton = function (text, columns, rows) {
        if (columns === void 0) { columns = 6; }
        if (rows === void 0) { rows = 1; }
        return {
            ActionType: 'share-phone',
            ActionBody: text,
            Text: text,
            Columns: columns,
            Rows: rows,
            BgColor: this.config.keyboardSettings.buttonColor,
        };
    };
    AntCore.prototype._AnyKeyboard = function (buttons, rows) {
        var keyboard = {
            Type: 'keyboard',
            Revision: 1,
            BgColor: this.config.keyboardSettings.backgroundColor,
            Buttons: buttons,
        };
        if (rows)
            keyboard.ButtonsGroupRows = rows;
        return keyboard;
    };
    AntCore.prototype._Keyboard = function (buttons) {
        return new Viber.Message.Keyboard(this._AnyKeyboard(buttons), null, null, null, 3);
    };
    AntCore.prototype._RichMedia = function (buttons, rows) {
        if (rows === void 0) { rows = 1; }
        return new Viber.Message.RichMedia(this._AnyKeyboard(buttons, rows), null, null, null, 3);
    };
    AntCore.prototype._TextMessage = function (text) {
        return new Viber.Message.Text(text);
    };
    AntCore.prototype._Picture = function (url, caption, thumbnail) {
        return new Viber.Message.Picture(url, caption, thumbnail);
    };
    AntCore.prototype._Url = function (url) {
        return new Viber.Message.Url(url);
    };
    AntCore.prototype._Contact = function (name, phone, avatar) {
        return new Viber.Message.Contact(name, phone, avatar);
    };
    AntCore.prototype._Video = function (url, size, caption, thumbnail, duration) {
        return new Viber.Message.Video(url, size, caption, thumbnail, duration);
    };
    AntCore.prototype._Location = function (latitude, longitude) {
        return new Viber.Message.Location(latitude, longitude);
    };
    AntCore.prototype._Sticker = function (stickerId) {
        return new Viber.Message.Sticker(stickerId);
    };
    AntCore.prototype._File = function (url, size, filename) {
        return new Viber.Message.File(url, size, filename);
    };
    AntCore.prototype.sendMessage = function (id, messages) {
        var _this = this;
        try {
            var user_1 = { id: id, apiVersion: 3 };
            return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.$api.sendMessage(user_1, messages)];
                        case 1:
                            _a.sent();
                            resolve();
                            return [2];
                    }
                });
            }); });
        }
        catch (err) {
            return Promise.reject(err);
        }
    };
    AntCore.prototype.addBasicListeners = function () {
        var _this = this;
        ['subscribed', 'unsubscribed'].forEach(function (type) {
            _this.on(type, function (messages) {
                var message = messages[0];
                var user = message.userProfile.id;
                _this.checkStatus(user, type);
            });
        }, this);
        ['message', 'message_sent'].forEach(function (type) {
            _this.on(type, function (messages) {
                var message = messages[0];
                var user = message.userProfile.id;
                _this.checkStatus(user, type, message.text, message.userProfile);
            });
        }, this);
        ['rich_payload'].forEach(function (type) {
            _this.on(type, function (messages) {
                var message = messages[0];
                var user = message.userProfile.id;
                _this.checkStatus(user, type, message.payloadData);
            });
        }, this);
        ['picture'].forEach(function (type) {
            _this.on(type, function (messages) {
                var message = messages[0];
                var user = message.userProfile.id;
                _this.checkStatus(user, type, message.picture);
            });
        }, this);
        ['sticker'].forEach(function (type) {
            _this.on(type, function (messages) {
                var message = messages[0];
                var user = message.userProfile.id;
                _this.checkStatus(user, type, message.stickerId);
            });
        }, this);
        ['file'].forEach(function (type) {
            _this.on(type, function (messages) {
                var message = messages[0];
                var user = message.userProfile.id;
                _this.checkStatus(user, type, message.file);
            });
        }, this);
        ['location'].forEach(function (type) {
            _this.on(type, function (messages) {
                var message = messages[0];
                var user = message.userProfile.id;
                _this.checkStatus(user, type, message.location);
            });
        }, this);
        ['contact'].forEach(function (type) {
            _this.on(type, function (messages) {
                var message = messages[0];
                var user = message.userProfile.id;
                _this.checkStatus(user, type, message.contact);
            });
        }, this);
    };
    AntCore.prototype.checkStatus = function (id, type, data, extra) {
        var _this = this;
        this.config.getStatus(id)
            .then(function (status) {
            if (['rich_payload'].includes(type)) {
                var richStatus = data.slice(0, data.indexOf(_this.config.richPayloadDataSeparator));
                var payload = data.slice(data.indexOf(_this.config.richPayloadDataSeparator)
                    + _this.config.richPayloadDataSeparator.length);
                if (Object.keys(_this.botListeners[type]).includes(richStatus)) {
                    return _this.botListeners[type][richStatus](id, payload, extra);
                }
                else {
                    for (var i in Object.keys(_this.botListeners[type])) {
                        var listener = Object.keys(_this.botListeners[type])[i];
                        if (_this.isMask(listener) && _this.isMatch(richStatus, listener)) {
                            return _this.botListeners[type][listener](id, payload, _this.isMatch(richStatus, listener));
                        }
                    }
                }
            }
            else {
                if (!status)
                    return;
                _this.botListeners[type] = _this.botListeners[type] || {};
                if (Object.keys(_this.botListeners[type]).includes(status)) {
                    return _this.botListeners[type][status](id, data, extra);
                }
                else {
                    for (var i in Object.keys(_this.botListeners[type])) {
                        var listener = Object.keys(_this.botListeners[type])[i];
                        if (_this.isMask(listener) && _this.isMatch(status, listener)) {
                            return _this.botListeners[type][listener](id, data, _this.isMatch(status, listener));
                        }
                    }
                }
            }
        })
            .catch(function (err) { return _this.onError(id, err); });
    };
    AntCore.prototype.onError = function (id, err) {
        this.emit('Error', Object.assign(err, { user_id: id }));
    };
    AntCore.prototype.isMask = function (mask) {
        return mask.split(this.config.maskSeparator).includes('*');
    };
    AntCore.prototype.isMatch = function (status, mask) {
        if (mask === '*')
            return status;
        var statusLevels = status.split(this.config.maskSeparator);
        var maskLevels = mask.split(this.config.maskSeparator);
        var maskMatch;
        if (maskLevels.length !== statusLevels.length) {
            return null;
        }
        for (var i = 0; i < maskLevels.length; i++) {
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
    };
    AntCore.prototype.setWebhook = function (url) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.$api.setWebhook(url).then(resolve).catch(reject);
        });
    };
    AntCore.prototype.middleware = function () {
        return this.$api.middleware();
    };
    return AntCore;
}(events_1.EventEmitter));
exports.AntCore = AntCore;
