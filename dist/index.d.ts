import * as T from './core/t';
import { AntCore } from './core/AntCore';
export declare class AntViber extends AntCore {
    constructor(authToken: string, name: string, avatar: string, config: T.AntViberConfig);
    add(type: 'message', status: string, listener: (id: string, text: string, user: T.ViberUserProfile) => any): void;
    add(type: 'message_sent', status: string, listener: (id: string, text: string, user: T.ViberUserProfile) => any): void;
    add(type: 'rich_payload', status: string, listener: (id: string, data: string) => any): void;
    add(type: 'subscribed', status: string, listener: (id: string) => any): void;
    add(type: 'unsubscribed', status: string, listener: (id: string) => any): void;
    add(type: 'sticker', status: string, listener: (id: string, stickerId: number) => any): void;
    add(type: 'picture', status: string, listener: (id: string, picture: T.ViberPicture) => any): void;
    add(type: 'file', status: string, listener: (id: string, file: T.ViberFile) => any): void;
    add(type: 'location', status: string, listener: (id: string, location: T.ViberLocation) => any): void;
    add(type: 'contact', status: string, listener: (id: string, contact: T.ViberContact) => any): void;
}
