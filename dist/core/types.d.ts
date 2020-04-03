import * as Viber from 'viber-bot';
import * as T from './t';
export interface IKeyboard {
    Type: 'keyboard';
    Revision: 1;
    BgColor: string;
    Buttons: IButton[];
    ButtonsGroupRows?: number;
}
declare type IButtonActionType = 'open-url' | 'reply' | 'location-picker' | 'share-phone';
export interface IButton {
    ActionType: IButtonActionType;
    ActionBody: string;
    Text: string;
    Columns: number;
    Rows: number;
    BgColor: string;
}
export interface ITypes {
    ReplyKeyboardButton(text: string, columns?: number, rows?: number): IButton;
    RichKeyboardButton(text: string, status: string, data: string, columns?: number, rows?: number): IButton;
    UrlKeyboardButton(text: string, url: string, columns?: number, rows?: number): IButton;
    ShareLocationButton(text: string, columns?: number, rows?: number): IButton;
    SharePhoneButton(text: string, columns?: number, rows?: number): IButton;
    Keyboard(buttons: IButton[]): Viber.Message.Keyboard;
    RichMedia(buttons: IButton[], rows?: number): Viber.Message.RichMedia;
    TextMessage(text: string): Viber.Message.Text;
    Picture(url: string, caption?: string): Viber.Message.Picture;
    Url(url: string): Viber.Message.Url;
    Contact(name: string, phone: string, avatar?: string): Viber.Message.Contact;
    Video(url: string, size: string, caption?: string, thumbnail?: string, duration?: number): Viber.Message.Video;
    Location(latitude: number, longitude: number): Viber.Message.Location;
    Sticker(stickerId: number): Viber.Message.Sticker;
    File(url: string, size: number, filename: string): Viber.Message.File;
}
export declare type MessageType = Viber.Message.Text | Viber.Message.Keyboard | Viber.Message.RichMedia | Viber.Message.Picture | Viber.Message.Url | Viber.Message.Contact | Viber.Message.Video | Viber.Message.Location | Viber.Message.Sticker | Viber.Message.File;
export interface BotLocation {
    lat: number;
    lon: number;
}
export interface BotMember {
    id: string;
    name: string;
    role: string;
}
export interface BotProfile {
    status: number;
    status_message: string;
    id: string;
    chat_hostname: string;
    name: string;
    uri: string;
    icon?: string;
    background?: string;
    category: string;
    subcategory: string;
    location?: BotLocation;
    country?: string;
    webhook?: string;
    event_types: string[];
    members: BotMember[];
    subscribers_count: number;
}
export interface BotUserOnlineStatus {
    id: string;
    online_status: number;
    online_status_message: string;
    last_online: number;
}
export interface BotOnlineStatus {
    status: number;
    status_message: string;
    users: BotUserOnlineStatus[];
}
export interface BotUserDetails {
    id: string;
    name: string;
    language: string;
    country: string;
    primary_device_os: string;
    api_version: number;
    viber_version: string;
    mcc: number;
    mnc: number;
    device_type: string;
}
export declare type onFinishHandler = (responseMessage: MessageType, optionalTrackingData?: {
    [key: string]: any;
}) => any;
export declare type onConversationStartedHandler = (userProfile: T.ViberUserProfile, isSubscribed: boolean, context: any, onFinish: onFinishHandler) => any;
export interface OnSubscribeResponse {
    userProfile: T.ViberUserProfile;
}
export declare type OnSubscribeHandler = (response: OnSubscribeResponse) => any;
export declare type OnUnsubscribeHandler = (id: string) => any;
export interface ViberAPI {
    getBotProfile(): Promise<BotProfile>;
    getUserDetails(user: T.ViberUserProfile): Promise<BotUserDetails>;
    getOnlineStatus(ids: string[]): Promise<BotOnlineStatus>;
    onConversationStarted(handler: onConversationStartedHandler): void;
    onSubscribe(handler: OnSubscribeHandler): void;
    onUnsubscribe(handler: OnUnsubscribeHandler): void;
}
export {};
