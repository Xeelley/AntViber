export interface AntViberConfig {
    getStatus: (chat_id: string) => Promise<string>;
    setStatus: (chat_id: string, status: string) => Promise<any>;
    maskSeparator?: string;
    richPayloadPrefix?: string;
    keyboardSettings?: ViberKeyboardConfig;
    startButtonText?: string;
}

export interface ViberKeyboardConfig {
    backgroundColor: string;
    frameColor: string;
    buttonColor: string;
    BorderWidth: number;
}

export interface Listeners {
    [key: string]: { [key in string]: Function };
}

export interface Commands {
    [key: string]: CommandCallback;
}

export interface ListenerCallback {
    (user_id: string, data: string, mask?: String): void;
}

export interface CommandCallback {
    (user_id: string, params: { [index: string]: string }, message: ViberMessage): void;
}

export type AntViberEvent = 'rich_payload' |
'message' |
'error' |
'Error';

export interface ViberMessage {
    text?: string;
} 

export interface ViberResponse {
    userProfile: ViberUserProfile;
}

export interface ViberUserProfile {
    id:        String;
    name:      String;
    avatar?:   String;
    language?: String;
    country?:  String;
}

export interface Message {
    text?: string;
    userProfile: ViberUserProfile;
}

export interface RichPayload {
    data?: string;
    userProfile: ViberUserProfile;
}

