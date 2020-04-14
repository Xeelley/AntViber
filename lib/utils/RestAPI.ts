import { request } from 'https';

import * as T from '../core/t';
import * as AntTypes from '../core/types';


const VIBER_HOST = 'chatapi.viber.com';
const VIBER_PATH = '/pa/send_message';


export interface APIResponse {
    status: number;
    status_message: string;
    message_token: number;
    chat_hostname: string;
}

export function sendMessage(user: T.ViberUserProfile | string, messages: AntTypes.MessageType[], 
config: T.AntConnectionConfig): Promise<APIResponse[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const res = []
            for (let i = 0; i < messages.length; i++) {
                res.push(await sendOne(user, messages[i], config));
            }
            return resolve(res)
        } catch(err) {
            return reject(err)
        }
    })
}

function sendOne(user: T.ViberUserProfile | string, message: AntTypes.MessageType, 
config: T.AntConnectionConfig): Promise<APIResponse> {
    return new Promise(async (resolve, reject) => {
        try {
            const body: { [key: string]: any } = {
                receiver: null,
                min_api_version: 2,
                sender: {
                    name: config.name,
                    avatar: config.avatar,
                },
                keyboard: null,
            }

            switch(typeof user) {
                case 'string': body.receiver = user; break;
                case 'object': body.receiver = user.id; break;
            }
            if (!body.receiver) {
                return reject(APIError('user is missing'))
            }

            if (message.minApiVersion && message.minApiVersion > body.min_api_version) {
                body.min_api_version = message.minApiVersion;
            }

            if (!message || !message.constructor || !message.constructor.name) {
                return reject(APIError('Invalid body'))
            }

            if (message.constructor.name === 'TextMessage') {
                body.type = 'text';
                body.text = message.text;
            }
            if (message.constructor.name === 'PictureMessage') {
                body.type = 'picture';
                body.text = message.text;
                body.media = message.url;
                body.thumbnail = message.thumbnail;
            }
            if (message.constructor.name === 'UrlMessage') {
                body.type = 'url';
                body.media = message.url;
            }
            if (message.constructor.name === 'ContactMessage') {
                body.type = 'contact';
                body.contact = { 
                    name: message.contactName, 
                    phone_number: message.contactPhoneNumber, 
                    avatar: message.contactAvatar,
                }
            }
            if (message.constructor.name === 'VideoMessage') {
                body.type = 'video';
                body.media = message.url;
                body.text = message.text;
                body.thumbnail = message.thumbnail;
                body.size = message.size;
                body.duration = message.duration;
            }
            if (message.constructor.name === 'LocationMessage') {
                body.type = 'location';
                body.location = {
                    lat: message.latitude,
                    lon: message.longitude,
                }
            }
            if (message.constructor.name === 'StickerMessage') {
                body.type = 'sticker';
                body.sticker_id = message.stickerId;
            }
            if (message.constructor.name === 'FileMessage') {
                body.type = 'file';
                body.media = message.url;
                body.size = message.sizeInBytes;
                body.file_name = message.filename;
            }
            if (message.constructor.name === 'KeyboardMessage') {
                if (!message.keyboard) return reject(APIError('keyboard is missing'))
                body.keyboard = {
                    Type: 'keyboard',
                    DefaultHeight: false,
                    Buttons: message.keyboard.Buttons,
                }
            }
            if (message.constructor.name === 'RichMediaMessage') {
                if (!message.richMedia) return reject(APIError('richMedia is missing'))
                body.type = 'rich_media';
                body.rich_media = {
                    Type: 'rich_media',
                    ButtonsGroupColumns: message.richMedia.ButtonsGroupColumns || 6,
                    ButtonsGroupRows: message.richMedia.ButtonsGroupRows || message.richMedia.Buttons.length,
                    BgColor: message.richMedia.BgColor || '#FFFFFF',
                    Revision: message.richMedia.Revision || 1,
                    Buttons: message.richMedia.Buttons,
                }
            }
            
            const res = await send(body, config.token)
            return resolve(res)

        } catch(err) {
            return reject(err)
        }
    })
}

function send(data: any, token: string): Promise<APIResponse> {
    return new Promise<any>((resolve, reject) => {
        const req = request({
            hostname: VIBER_HOST,
            port: 443,
            path: VIBER_PATH,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Viber-Auth-Token': token,
            },
        }, res => {
            let response = '';
            res.on('data', (chunk: Buffer) => {
                response += chunk.toString()
            })
            res.on('end', () => {
                try {
                    if (!response) return reject(APIError('Viber REST API returns nothing. Check request body'))
                    const responseObj = JSON.parse(response);
                    return responseObj.status === 0 ? resolve(responseObj) : reject(responseObj)
                } catch(err) {
                    return reject(new Error('API returns invalid response, check request body'))
                }
            })
        })
        req.on('error', err => reject(err))
        req.write(JSON.stringify(data))
        req.end()
    })
}

function APIError(message: string): { [key: string]: string | number } {
    return {
        status: 3,
        status_message: message,
        chat_hostname: 'Ant',
    }
}