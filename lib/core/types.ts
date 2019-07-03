import * as T from './t';
import * as Viber from 'viber-bot';


export interface IKeyboard {
    Type: 'keyboard';
    Revision: 1;
    BgColor: string;
    Buttons: IButton[];
    ButtonsGroupRows: number;
}

type IButtonActionType = 'open-url' | 'reply';

export interface IButton {
    ActionType: IButtonActionType;
    ActionBody: string;
    Text: string;
    Columns: number;
    Rows: number;
    BgColor: string;
    Frame: {
        BorderWidth: number,
        BorderColor: string,
    }
}

export interface ITypes {
    ReplyKeyboardButton(text: string, columns?: number, rows?: number): IButton;
    RichKeyboardButton(text: string, data: string, columns?: number, rows?: number): IButton;
    UrlKeyboardButton(text: string, url: string, columns?: number, rows?: number): IButton;
    TextMessage(text: string): Viber.Message.Text;
    Keyboard(buttons: IButton[], rows?: number): Viber.Message.Keyboard;
    RichMedia(buttons: IButton[], rows?: number): Viber.Message.RichMedia;
    Picture(url: string, caption?: string): Viber.Message.Picture;
} 

export type MessageType = Viber.Message.Text |
Viber.Message.Keyboard |
Viber.Message.RichMedia |
Viber.Message.Picture;

