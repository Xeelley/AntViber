export interface AntViberConfig {
    getStatus: (chat_id: string) => Promise<string>;
    setStatus: (chat_id: string, status: string) => Promise<any>;
    maskSeparator?: string;
    richPayloadPrefix?: string;
    keyboardSettings?: ViberKeyboardConfig;
    startButtonText?: string;
    richPayloadDataSeparator?: string;
}
export interface ViberKeyboardConfig {
    backgroundColor: string;
    frameColor: string;
    buttonColor: string;
    BorderWidth: number;
}
export interface Listeners {
    [key: string]: {
        [key in string]: Function;
    };
}
export interface Commands {
    [key: string]: CommandCallback;
}
export interface ListenerCallback {
    (user: string, data: string, mask?: String): void;
}
export interface CommandCallback {
    (user: string, params: {
        [index: string]: string;
    }, message: ViberMessage): void;
}
export declare type AntViberEvent = 'rich_payload' | 'message' | 'error' | 'message_sent' | 'subscribed' | 'unsubscribed' | 'Error';
export interface ViberMessage {
    text?: string;
}
export interface ViberResponse {
    userProfile: ViberUserProfile;
}
export interface ViberUserProfile {
    id: String;
    name: String;
    avatar?: String;
    language?: String;
    country?: String;
}
export interface Message {
    text?: string;
    userProfile: ViberUserProfile;
    payloadData?: string;
}
