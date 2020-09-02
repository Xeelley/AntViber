import * as T from '../core/t';
import * as AntTypes from '../core/types';
export declare function setConfig(_: T.AntViberConfig): void;
export interface APIResponse {
    status: number;
    status_message: string;
    message_token: number;
    chat_hostname: string;
}
export declare function sendMessage(user: T.ViberUserProfile | string, messages: AntTypes.MessageType[], config: T.AntConnectionConfig): Promise<APIResponse[]>;
export declare function send(data: any, token: string, retries?: number): Promise<APIResponse>;
