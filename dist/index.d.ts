import * as T from './core/t';
import { AntCore } from './core/AntCore';
export declare class AntViber extends AntCore {
    constructor(authToken: string, name: string, avatar: string, config: T.AntViberConfig);
    add(type: 'message', status: string, listener: (user: T.ViberUserProfile, text: string) => any): void;
    add(type: 'message_sent', status: string, listener: (user: T.ViberUserProfile, text: string) => any): void;
    add(type: 'rich_payload', status: string, listener: (user: T.ViberUserProfile, data: string) => any): void;
    add(type: 'subscribed', status: string, listener: (user: T.ViberUserProfile) => any): void;
    add(type: 'unsubscribed', status: string, listener: (user: T.ViberUserProfile) => any): void;
    add(type: 'sticker', status: string, listener: (user: T.ViberUserProfile, stickerId: number) => any): void;
    add(type: 'picture', status: string, listener: (user: T.ViberUserProfile, picture: T.ViberPicture) => any): void;
    add(type: 'file', status: string, listener: (user: T.ViberUserProfile, file: T.ViberFile) => any): void;
    add(type: 'location', status: string, listener: (user: T.ViberUserProfile, location: T.ViberLocation) => any): void;
    add(type: 'contact', status: string, listener: (user: T.ViberUserProfile, contact: T.ViberContact) => any): void;
}
