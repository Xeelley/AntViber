import * as T from './core/t';
import { AntCore } from './core/AntCore';
export declare class AntViber extends AntCore {
    constructor(authToken: string, name: string, avatar: string, config: T.AntViberConfig);
    add(type: 'message', status: string, listener: (user: string, text: string) => any): void;
    add(type: 'message_sent', status: string, listener: (user: string, text: string) => any): void;
    add(type: 'rich_payload', status: string, listener: (user: string, data: string) => any): void;
    add(type: 'subscribed', status: string, listener: (user: string) => any): void;
    add(type: 'unsubscribed', status: string, listener: (user: string) => any): void;
    add(type: 'sticker', status: string, listener: (user: string, stickerId: number) => any): void;
    add(type: 'picture', status: string, listener: (user: string, picture: T.ViberPicture) => any): void;
    add(type: 'file', status: string, listener: (user: string, file: T.ViberFile) => any): void;
    add(type: 'location', status: string, listener: (user: string, location: T.ViberLocation) => any): void;
    add(type: 'contact', status: string, listener: (user: string, contact: T.ViberContact) => any): void;
}
