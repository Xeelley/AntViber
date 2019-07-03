import { EventEmitter } from 'events';
import * as Viber from 'viber-bot';
import * as AntTypes from './types';

import * as T from './t';


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
        config.maskSeparator     = config.maskSeparator || ':'; 
        config.richPayloadPrefix = config.richPayloadPrefix || '[VCD]';
        config.startButtonText   = config.startButtonText || 'Start!';
        config.keyboardSettings  = config.keyboardSettings || { 
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
            ReplyKeyboardButton: this._ReplyKeyboardButton,
            RichKeyboardButton:  this._RichKeyboardButton,
            UrlKeyboardButton:   this._UrlKeyboardButton,
            TextMessage:         this._TextMessage,
            Keyboard:            this._Keyboard,
            RichMedia:           this._RichMedia,
            Picture:             this._Picture,
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
    }

    private addListeners() {
        this.$api.on(Viber.Events.MESSAGE_RECEIVED, (message: T.ViberMessage, response: T.ViberResponse) => {
            const text   = message.text || '';
            const user   = response.userProfile;
            const prefix = this.config.richPayloadPrefix;
            if (text.slice(0, prefix.length) === prefix) {
                const payload: T.RichPayload = {
                    data: text.slice(prefix.length),
                    userProfile: user,
                }
                this.emit('rich_payload', payload);
            } else {
                const message: T.Message = {
                    text,
                    userProfile: user,
                }
                this.emit('message', message);
            }
        })
        this.$api.on(Viber.Event.CONVERSATION_STARTED, (userProfile: T.ViberUserProfile,
        isSubscribed: boolean, context: any, onFinish: Function) => {
            const keyboard = this.Types.Keyboard([
                this.Types.RichKeyboardButton(this.config.startButtonText, '/start')
            ]);
            onFinish(this.Types.RichMedia(keyboard));
        })
        this.$api.on(Viber.Event.ERROR, (err: Error) => {
            this.emit('error', err);
            this.emit('Error', err);
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
    private _RichKeyboardButton(text: string, data: string, columns: number = 6, rows: number = 1): AntTypes.IButton {
        return {
            ActionType: 'reply',
            ActionBody: '[VCD]' + data,
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

}
