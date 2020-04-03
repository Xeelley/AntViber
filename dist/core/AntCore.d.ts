import { EventEmitter } from 'events';
import * as Viber from 'viber-bot';
import * as AntTypes from './types';
import * as T from './t';
export declare class AntCore extends EventEmitter {
    protected $api: Viber.Bot;
    Types: AntTypes.ITypes;
    private config;
    protected botListeners: T.Listeners;
    protected commands: T.Commands;
    constructor(authToken: string, name: string, avatar: string, config: T.AntViberConfig);
    command(command: string, method: T.CommandCallback): void;
    status(id: string, status: string): Promise<any>;
    on(event: T.AntViberEvent, listener: (...args: any[]) => void): any;
    emit(event: T.AntViberEvent, ...args: any[]): any;
    private init;
    private addListeners;
    private _ReplyKeyboardButton;
    private _RichKeyboardButton;
    private _UrlKeyboardButton;
    private _ShareLocationButton;
    private _SharePhoneButton;
    private _AnyKeyboard;
    private _Keyboard;
    private _RichMedia;
    private _TextMessage;
    private _Picture;
    private _Url;
    private _Contact;
    private _Video;
    private _Location;
    private _Sticker;
    private _File;
    sendMessage(user: T.ViberUserProfile, messages: AntTypes.MessageType[]): Promise<void>;
    private addBasicListeners;
    private checkStatus;
    private onError;
    private isMask;
    private isMatch;
    setWebhook(url: string): Promise<void>;
    middleware(): any;
}
