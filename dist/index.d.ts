import * as T from './core/t';
import { AntCore } from './core/AntCore';
export declare class AntViber extends AntCore {
    constructor(authToken: string, name: string, avatar: string, config: T.AntViberConfig);
    add(type: 'message', status: string, listener: (user: string, text: string) => any): void;
    add(type: 'message_sent', status: string, listener: (user: string, text: string) => any): void;
    add(type: 'rich_payload', status: string, listener: (user: string, data: string) => any): void;
    add(type: 'subscribed', status: string, listener: (user: string) => any): void;
    add(type: 'unsubscribed', status: string, listener: (user: string) => any): void;
}
