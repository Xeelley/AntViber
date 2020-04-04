import * as T from '../core/t';
import * as AntTypes from '../core/types';
export interface APIResponse {
    status: number;
    status_message: string;
    message_token: number;
    chat_hostname: string;
}
export declare function sendMessage(user: T.ViberUserProfile, messages: AntTypes.MessageType[], config: T.AntConnectionConfig): Promise<APIResponse[]>;
