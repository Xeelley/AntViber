import * as T from './core/t';
import { AntAPI } from './core/AntAPI';


export class AntViber extends AntAPI {

    constructor(authToken: string, name: string, avatar: string, config: T.AntViberConfig) {
        super(authToken, name, avatar, config);
    }

    public add(type: 'message', status: string, listener: (user: T.ViberUserProfile, text: string) => any): void;
    public add(type: 'message_sent', status: string, listener: (user: T.ViberUserProfile, text: string) => any): void;
    public add(type: 'rich_payload', status: string, listener: (user: T.ViberUserProfile, data: string) => any): void;
    public add(type: 'subscribed', status: string, listener: (user: T.ViberUserProfile) => any): void;
    public add(type: 'unsubscribed', status: string, listener: (user: T.ViberUserProfile) => any): void;
    public add(type: 'sticker', status: string, listener: (user: T.ViberUserProfile, stickerId: number) => any): void;
    public add(type: 'picture', status: string, listener: (user: T.ViberUserProfile, picture: T.ViberPicture) => any): void;
    public add(type: 'file', status: string, listener: (user: T.ViberUserProfile, file: T.ViberFile) => any): void;
    public add(type: 'location', status: string, listener: (user: T.ViberUserProfile, location: T.ViberLocation) => any): void;
    public add(type: 'contact', status: string, listener: (user: T.ViberUserProfile, contact: T.ViberContact) => any): void;

    public add(type: T.AntViberEvent, status: string, listener?: Function) {
        if (!this.botListeners[type]) this.botListeners[type] = {};
        this.botListeners[type][status] = listener;
    }
}