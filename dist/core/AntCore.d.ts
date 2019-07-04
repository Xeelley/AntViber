/// <reference types="node" />
import { EventEmitter } from 'events';
import * as AntTypes from './types';
import * as T from './t';
export declare class AntCore extends EventEmitter {
    private $api;
    Types: AntTypes.ITypes;
    private config;
    protected botListeners: T.Listeners;
    protected commands: T.Commands;
    constructor(authToken: string, name: string, avatar: string, config: T.AntViberConfig);
    command(command: string, method: T.CommandCallback): void;
    status(chat_id: string, status: string): Promise<any>;
    on(event: T.AntViberEvent, listener: (...args: any[]) => void): any;
    emit(event: T.AntViberEvent, ...args: any[]): any;
    private init;
    private addListeners;
    private _ReplyKeyboardButton;
    private _RichKeyboardButton;
    private _UrlKeyboardButton;
    private _AnyKeyboard;
    private _TextMessage;
    private _Keyboard;
    private _RichMedia;
    private _Picture;
    sendMessage(userProfile: string, messages: AntTypes.MessageType[]): Promise<void>;
    private addBasicListeners;
    private checkStatus;
    private onError;
    private isMask;
    private isMatch;
    setWebhook(url: string): Promise<void>;
    middleware(): any;
}
