import * as T from './core/t';
import { AntCore } from './core/AntCore';


export class AntViber extends AntCore {

    constructor(authToken: string, name: string, avatar: string, config: T.AntViberConfig) {
        super(authToken, name, avatar, config);
    }

    public add(type: 'message', status: string, listener: (user: string, text: string) => any): void;
    public add(type: 'message_sent', status: string, listener: (user: string, text: string) => any): void;
    public add(type: 'rich_payload', status: string, listener: (user: string, data: string) => any): void;
    public add(type: 'subscribed', status: string, listener: (user: string) => any): void;
    public add(type: 'unsubscribed', status: string, listener: (user: string) => any): void;
    public add(type: 'sticker', status: string, listener: (user: string, stickerId: number) => any): void;
    public add(type: 'picture', status: string, listener: (user: string, picture: T.ViberPicture) => any): void;
    public add(type: 'file', status: string, listener: (user: string, file: T.ViberFile) => any): void;
    public add(type: 'location', status: string, listener: (user: string, location: T.ViberLocation) => any): void;
    public add(type: 'contact', status: string, listener: (user: string, contact: T.ViberContact) => any): void;

    public add(type: T.AntViberEvent, status: string, listener?: Function) {
        if (!this.botListeners[type]) this.botListeners[type] = {};
        this.botListeners[type][status] = listener;
    }
}