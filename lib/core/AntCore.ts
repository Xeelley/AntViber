import { EventEmitter } from 'events';
import * as Viber from 'viber-bot';
import * as AntTypes from './types';

import * as T from './t';

import { CommandParser } from '../utils/CommandParser';


export class AntCore extends EventEmitter {

    private $api: Viber.Bot;
    public Types: AntTypes.ITypes;

    private config: T.AntViberConfig;

    protected botListeners: T.Listeners = {};
    protected commands: T.Commands = {};


    constructor(authToken: string, name: string, avatar: string, config: T.AntViberConfig) {
        super();

        if (!config.getStatus) throw new Error('Ant: config.getStatus not provided! This field is mandatory.');
        if (!config.setStatus) throw new Error('Ant: config.setStatus not provided! This field is mandatory.');
        config.maskSeparator            = config.maskSeparator || ':'; 
        config.richPayloadPrefix        = config.richPayloadPrefix || '[VCD]';
        config.startButtonText          = config.startButtonText || 'Start!';
        config.richPayloadDataSeparator = config.richPayloadDataSeparator || '$:';
        config.keyboardSettings         = config.keyboardSettings || { 
            backgroundColor: '#FFFFFF', 
            frameColor: '#665CAC', 
            buttonColor: '#FFFFFF',
            BorderWidth: 2,
        };
        config.keyboardSettings.backgroundColor = config.keyboardSettings.backgroundColor || '#FFFFFF'; 
        config.keyboardSettings.frameColor      = config.keyboardSettings.frameColor || '#665CAC'; 
        config.keyboardSettings.buttonColor     = config.keyboardSettings.buttonColor || '#FFFFFF'; 
        config.keyboardSettings.BorderWidth     = config.keyboardSettings.BorderWidth || 2; 

        this.config = config;

        this.$api = new Viber.Bot({ authToken, name, avatar });

        this.Types = {
            ReplyKeyboardButton: this._ReplyKeyboardButton.bind(this),
            RichKeyboardButton:  this._RichKeyboardButton.bind(this),
            UrlKeyboardButton:   this._UrlKeyboardButton.bind(this),
            TextMessage:         this._TextMessage.bind(this),
            Keyboard:            this._Keyboard.bind(this),
            RichMedia:           this._RichMedia.bind(this),
            Picture:             this._Picture.bind(this),
        };

        this.init();
    }

    public command(command: string, method: T.CommandCallback) {
        this.commands[command] = method;
    }

    public status(chat_id: string, status: string): Promise<any> {
        return this.config.setStatus(chat_id, status);
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
            if (text.slice(0, prefix.length) === prefix) {
                const payload: T.Message = {
                    payloadData: text.slice(prefix.length),
                    userProfile: user,
                }
                let command = payload.payloadData.slice(0, payload.payloadData.indexOf(this.config.richPayloadDataSeparator));
                command = command.indexOf('?') !== -1 ? command.slice(0, command.indexOf('?')) : command;

                if (Object.keys(this.commands).includes(command)) {
                    this.commands[command](JSON.stringify(user), CommandParser.parse(text), message);
                    return;
                } else {  
                    this.emit('rich_payload', payload);
                }
            } else {
                const command = text.indexOf('?') !== -1 ?
                text.slice(0, text.indexOf('?')) : text;
    
                if (Object.keys(this.commands).includes(command)) {
                    this.commands[command](JSON.stringify(user), CommandParser.parse(text), message);
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
        this.$api.onConversationStarted((userProfile: T.ViberUserProfile,
        isSubscribed: boolean, context: any, onFinish: Function) => {
            const keyboard = this.Types.RichMedia([
                this.Types.RichKeyboardButton(this.config.startButtonText, '/start', '/start')
            ]);
            onFinish(keyboard);
        })
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
            BgColor: this.config.keyboardSettings.backgroundColor,
            Frame: {
                BorderWidth: this.config.keyboardSettings.BorderWidth,
                BorderColor: this.config.keyboardSettings.frameColor,
            }
        }
    }
    private _RichKeyboardButton(text: string, status: string, data: string, columns: number = 6, rows: number = 1): AntTypes.IButton {
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
        }
    }
    private _UrlKeyboardButton(text: string, url: string, columns: number = 6, rows: number = 1): AntTypes.IButton {
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
        }
    }
    private _AnyKeyboard(buttons: AntTypes.IButton[], rows: number = 1): AntTypes.IKeyboard {
        return {
            Type: 'keyboard',
            Revision: 1,
            BgColor: this.config.keyboardSettings.backgroundColor,
            Buttons: buttons,
            ButtonsGroupRows: rows,
        }
    }
    private _TextMessage(text: string): Viber.Message.Text {
        return new Viber.Message.Text(text);
    }
    private _Keyboard(buttons: AntTypes.IButton[], rows: number = 1): Viber.Message.Keyboard {
        return new Viber.Message.Keyboard(this._AnyKeyboard(buttons, rows));
    }
    private _RichMedia(buttons: AntTypes.IButton[], rows: number = 1): Viber.Message.RichMedia {
        return new Viber.Message.RichMedia(this._AnyKeyboard(buttons, rows));
    }
    private _Picture(url: string, caption?: string): Viber.Message.Picture {
        return new Viber.Message.Picture(url, caption);
    }

    public sendMessage(userProfile: string, messages: AntTypes.MessageType[]): Promise<void> {
        const user = JSON.parse(userProfile);
        return new Promise((resolve, reject) => {
            this.$api.sendMessage(user, messages)
            .then(resolve)
            .catch((err: Error) => {
                this.emit('error', err);
                return reject(err);
            });
        });
    }

    private addBasicListeners() {
        const basicEvents: T.AntViberEvent[] = [ 'message', 'message_sent', 'rich_payload', 
        'subscribed', 'unsubscribed' ];
        basicEvents.forEach(type => {
            this.on(type, (messages: T.Message[]) => {
                const message = messages[0];
                const user = JSON.stringify(message.userProfile);
                this.checkStatus(user, type, message.text || message.payloadData || null);
            })
        }, this);
    }

    private checkStatus(user: string, type: T.AntViberEvent, data: string, extra?: any) {
        this.config.getStatus(user)
        .then(status => {
            if ([ 'rich_payload' ].includes(type)) {
                const richStatus = data.slice(0, data.indexOf(this.config.richPayloadDataSeparator));
                const payload    = data.slice(data.indexOf(this.config.richPayloadDataSeparator) 
                                 + this.config.richPayloadDataSeparator.length);
                
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
        .catch((err: Error) => this.onError(user, err));
    }

    private onError(user: string, err: Error) {
        this.emit('Error', Object.assign(err, { userProfile: user }));
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
