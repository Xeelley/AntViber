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
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var Viber = require("viber-bot");
var CommandParser_1 = require("../utils/CommandParser");
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
        config.maskSeparator = config.maskSeparator || ':';
        config.richPayloadPrefix = config.richPayloadPrefix || '[VCD]';
        config.startButtonText = config.startButtonText || 'Start!';
        config.richPayloadDataSeparator = config.richPayloadDataSeparator || '$:';
        config.keyboardSettings = config.keyboardSettings || {
            backgroundColor: '#FFFFFF',
            frameColor: '#665CAC',
            buttonColor: '#FFFFFF',
            BorderWidth: 2,
        };
        config.keyboardSettings.backgroundColor = config.keyboardSettings.backgroundColor || '#FFFFFF';
        config.keyboardSettings.frameColor = config.keyboardSettings.frameColor || '#665CAC';
        config.keyboardSettings.buttonColor = config.keyboardSettings.buttonColor || '#FFFFFF';
        config.keyboardSettings.BorderWidth = config.keyboardSettings.BorderWidth || 2;
        _this.config = config;
        _this.$api = new Viber.Bot({ authToken: authToken, name: name, avatar: avatar });
        _this.Types = {
            ReplyKeyboardButton: _this._ReplyKeyboardButton.bind(_this),
            RichKeyboardButton: _this._RichKeyboardButton.bind(_this),
            UrlKeyboardButton: _this._UrlKeyboardButton.bind(_this),
            TextMessage: _this._TextMessage.bind(_this),
            Keyboard: _this._Keyboard.bind(_this),
            RichMedia: _this._RichMedia.bind(_this),
            Picture: _this._Picture.bind(_this),
        };
        _this.init();
        return _this;
    }
    AntCore.prototype.command = function (command, method) {
        this.commands[command] = method;
    };
    AntCore.prototype.status = function (chat_id, status) {
        return this.config.setStatus(chat_id, status);
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
            if (text.slice(0, prefix.length) === prefix) {
                var payload = {
                    payloadData: text.slice(prefix.length),
                    userProfile: user,
                };
                var command = payload.payloadData.slice(0, payload.payloadData.indexOf(_this.config.richPayloadDataSeparator));
                command = command.indexOf('?') !== -1 ? command.slice(0, command.indexOf('?')) : command;
                console.log(command);
                if (Object.keys(_this.commands).includes(command)) {
                    _this.commands[command](JSON.stringify(user), CommandParser_1.CommandParser.parse(text), message);
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
                    _this.commands[command](JSON.stringify(user), CommandParser_1.CommandParser.parse(text), message);
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
            BgColor: this.config.keyboardSettings.backgroundColor,
            Frame: {
                BorderWidth: this.config.keyboardSettings.BorderWidth,
                BorderColor: this.config.keyboardSettings.frameColor,
            }
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
            BgColor: this.config.keyboardSettings.backgroundColor,
            Frame: {
                BorderWidth: this.config.keyboardSettings.BorderWidth,
                BorderColor: this.config.keyboardSettings.frameColor,
            }
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
            BgColor: this.config.keyboardSettings.backgroundColor,
            Frame: {
                BorderWidth: this.config.keyboardSettings.BorderWidth,
                BorderColor: this.config.keyboardSettings.frameColor,
            }
        };
    };
    AntCore.prototype._AnyKeyboard = function (buttons, rows) {
        if (rows === void 0) { rows = 1; }
        return {
            Type: 'keyboard',
            Revision: 1,
            BgColor: this.config.keyboardSettings.backgroundColor,
            Buttons: buttons,
            ButtonsGroupRows: rows,
        };
    };
    AntCore.prototype._TextMessage = function (text) {
        return new Viber.Message.Text(text);
    };
    AntCore.prototype._Keyboard = function (buttons, rows) {
        if (rows === void 0) { rows = 1; }
        return new Viber.Message.Keyboard(this._AnyKeyboard(buttons, rows));
    };
    AntCore.prototype._RichMedia = function (buttons, rows) {
        if (rows === void 0) { rows = 1; }
        return new Viber.Message.RichMedia(this._AnyKeyboard(buttons, rows));
    };
    AntCore.prototype._Picture = function (url, caption) {
        return new Viber.Message.Picture(url, caption);
    };
    AntCore.prototype.sendMessage = function (userProfile, messages) {
        var _this = this;
        var user = JSON.parse(userProfile);
        return new Promise(function (resolve, reject) {
            _this.$api.sendMessage(user, messages)
                .then(resolve)
                .catch(function (err) {
                _this.emit('error', err);
                return reject(err);
            });
        });
    };
    AntCore.prototype.addBasicListeners = function () {
        var _this = this;
        var basicEvents = ['message', 'message_sent', 'rich_payload',
            'subscribed', 'unsubscribed'];
        basicEvents.forEach(function (type) {
            _this.on(type, function (messages) {
                var message = messages[0];
                var user = JSON.stringify(message.userProfile);
                _this.checkStatus(user, type, message.text || message.payloadData || null);
            });
        }, this);
    };
    AntCore.prototype.checkStatus = function (user, type, data, extra) {
        var _this = this;
        this.config.getStatus(user)
            .then(function (status) {
            if (['rich_payload'].includes(type)) {
                var richStatus = data.slice(0, data.indexOf(_this.config.richPayloadDataSeparator));
                var payload = data.slice(data.indexOf(_this.config.richPayloadDataSeparator)
                    + _this.config.richPayloadDataSeparator.length);
                if (Object.keys(_this.botListeners[type]).includes(richStatus)) {
                    return _this.botListeners[type][richStatus](user, payload, extra);
                }
                else {
                    for (var i in Object.keys(_this.botListeners[type])) {
                        var listener = Object.keys(_this.botListeners[type])[i];
                        if (_this.isMask(listener) && _this.isMatch(richStatus, listener)) {
                            return _this.botListeners[type][listener](user, payload, _this.isMatch(richStatus, listener));
                        }
                    }
                }
            }
            else {
                if (!status)
                    return;
                _this.botListeners[type] = _this.botListeners[type] || {};
                if (Object.keys(_this.botListeners[type]).includes(status)) {
                    return _this.botListeners[type][status](user, data, extra);
                }
                else {
                    for (var i in Object.keys(_this.botListeners[type])) {
                        var listener = Object.keys(_this.botListeners[type])[i];
                        if (_this.isMask(listener) && _this.isMatch(status, listener)) {
                            return _this.botListeners[type][listener](user, data, _this.isMatch(status, listener));
                        }
                    }
                }
            }
        })
            .catch(function (err) { return _this.onError(user, err); });
    };
    AntCore.prototype.onError = function (user, err) {
        this.emit('Error', Object.assign(err, { userProfile: user }));
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
