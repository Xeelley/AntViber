import * as T from './core/t';
import { AntCore } from './core/AntCore';


export class AntViber extends AntCore {

    constructor(authToken: string, name: string, avatar: string, config: T.AntViberConfig) {
        super(authToken, name, avatar, config);
    }

    public add(type: 'message', status: string, listener: (id: string, text: string, user: T.ViberUserProfile) => any): void;
    public add(type: 'message_sent', status: string, listener: (id: string, text: string, user: T.ViberUserProfile) => any): void;
    public add(type: 'rich_payload', status: string, listener: (id: string, data: string) => any): void;
    public add(type: 'subscribed', status: string, listener: (id: string) => any): void;
    public add(type: 'unsubscribed', status: string, listener: (id: string) => any): void;
    public add(type: 'sticker', status: string, listener: (id: string, stickerId: number) => any): void;
    public add(type: 'picture', status: string, listener: (id: string, picture: T.ViberPicture) => any): void;
    public add(type: 'file', status: string, listener: (id: string, file: T.ViberFile) => any): void;
    public add(type: 'location', status: string, listener: (id: string, location: T.ViberLocation) => any): void;
    public add(type: 'contact', status: string, listener: (id: string, contact: T.ViberContact) => any): void;

    public add(type: T.AntViberEvent, status: string, listener?: Function) {
        if (!this.botListeners[type]) this.botListeners[type] = {};
        this.botListeners[type][status] = listener;
    }
}