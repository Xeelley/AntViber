import * as Viber from 'viber-bot';
export interface IKeyboard {
    Type: 'keyboard';
    Revision: 1;
    BgColor: string;
    Buttons: IButton[];
    ButtonsGroupRows: number;
}
declare type IButtonActionType = 'open-url' | 'reply';
export interface IButton {
    ActionType: IButtonActionType;
    ActionBody: string;
    Text: string;
    Columns: number;
    Rows: number;
    BgColor: string;
    Frame: {
        BorderWidth: number;
        BorderColor: string;
    };
}
export interface ITypes {
    ReplyKeyboardButton(text: string, columns?: number, rows?: number): IButton;
    RichKeyboardButton(text: string, status: string, data: string, columns?: number, rows?: number): IButton;
    UrlKeyboardButton(text: string, url: string, columns?: number, rows?: number): IButton;
    TextMessage(text: string): Viber.Message.Text;
    Keyboard(buttons: IButton[], rows?: number): Viber.Message.Keyboard;
    RichMedia(buttons: IButton[], rows?: number): Viber.Message.RichMedia;
    Picture(url: string, caption?: string): Viber.Message.Picture;
}
export declare type MessageType = Viber.Message.Text | Viber.Message.Keyboard | Viber.Message.RichMedia | Viber.Message.Picture;
export {};
