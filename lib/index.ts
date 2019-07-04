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

    public add(type: T.AntViberEvent, status: string, listener?: T.ListenerCallback) {
        if (!this.botListeners[type]) this.botListeners[type] = {};
        this.botListeners[type][status] = listener;
    }
}