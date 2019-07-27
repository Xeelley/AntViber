import * as Viber from 'viber-bot';
export interface IKeyboard {
    Type: 'keyboard';
    Revision: 1;
    BgColor: string;
    Buttons: IButton[];
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
    Keyboard(buttons: IButton[], rows?: number): Viber.Message.Keyboard;
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
export {};
