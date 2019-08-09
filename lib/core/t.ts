export interface AntViberConfig {
    getStatus: (user: string) => Promise<string>;
    setStatus: (user: string, status: string) => Promise<any>;
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
    [key: string]: { [key in string]: Function };
}

export interface Commands {
    [key: string]: CommandCallback;
}

export interface CommandCallback {
    (id: string, params: { [index: string]: string }, user: ViberUserProfile, message: ViberMessage): void;
}

export type AntViberEvent = 'rich_payload' |
'message' |
'error' |
'message_sent' |
'subscribed' |
'picture' | 
'file' |
'contact' |
'sticker' |
'location' |
'unsubscribed' |
'Error';

export interface ViberLocation {
    latitude: number;
    longitude: number;
}

export interface ViberContact {
    name: string;
    phone: string;
    avatar?: string;
}

export interface ViberPicture {
    url: string;
    thumbnail: string;
    caption?: string;
}

export interface ViberFile {
    url: string;
    filename: string;
    size: number;
}

export interface ViberMessage {
    text?: string;
    url?: string;
    thumbnail?: string;
    sizeInBytes?: number;
    stickerId?: number;
    filename?: string;
    latitude?: number;
    longitude?: number;
    contactName?: string;
    contactPhoneNumber?: string;
    contactAvatar?: string;
} 

export interface ViberResponse {
    userProfile: ViberUserProfile;
}

export interface ViberUserProfile {
    id:        string;
    name:      string;
    avatar?:   string;
    language?: string;
    country?:  string;
}

export interface Message {
    text?: string;
    userProfile: ViberUserProfile;
    payloadData?: string;
    stickerId?: number;
    location?: ViberLocation;
    contact?: ViberContact;
    picture?: ViberPicture;
    file?: ViberFile;
}

