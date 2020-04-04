"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = require("https");
const VIBER_HOST = 'chatapi.viber.com';
const VIBER_PATH = '/pa/send_message';
function sendMessage(user, messages, config) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            const res = [];
            for (let i = 0; i < messages.length; i++) {
                res.push(yield sendOne(user, messages[i], config));
            }
            return resolve(res);
        }
        catch (err) {
            return reject(err);
        }
    }));
}
exports.sendMessage = sendMessage;
function sendOne(user, message, config) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            const body = {
                receiver: user.id,
                min_api_version: 2,
                sender: {
                    name: config.name,
                    avatar: config.avatar,
                },
                keyboard: null,
            };
            if (message.minApiVersion && message.minApiVersion > body.min_api_version) {
                body.min_api_version = message.minApiVersion;
            }
            if (!message || !message.constructor || !message.constructor.name)
                return reject(new Error('Invalid body'));
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
                };
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
                };
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
                if (!message.keyboard)
                    return reject(APIError('keyboard is missing'));
                body.keyboard = {
                    Type: 'keyboard',
                    DefaultHeight: true,
                    Buttons: message.keyboard.Buttons,
                };
            }
            if (message.constructor.name === 'RichMediaMessage') {
                if (!message.richMedia)
                    return reject(APIError('richMedia is missing'));
                body.type = 'rich_media';
                body.rich_media = {
                    Type: 'rich_media',
                    ButtonsGroupColumns: message.richMedia.ButtonsGroupColumns || 6,
                    ButtonsGroupRows: message.richMedia.ButtonsGroupRows || 1,
                    BgColor: message.richMedia.BgColor || '#FFFFFF',
                    Revision: message.richMedia.Revision || 1,
                    Buttons: message.richMedia.Buttons,
                };
            }
            const res = yield send(body, config.token);
            return resolve(res);
        }
        catch (err) {
            return reject(err);
        }
    }));
}
function send(data, token) {
    return new Promise((resolve, reject) => {
        const req = https_1.request({
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
            res.on('data', (chunk) => {
                response += chunk.toString();
            });
            res.on('end', () => {
                try {
                    const responseObj = JSON.parse(response);
                    return responseObj.status === 0 ? resolve(responseObj) : reject(responseObj);
                }
                catch (err) {
                    return reject(new Error('API returns invalid response, check request body'));
                }
            });
        });
        req.on('error', err => reject(err));
        req.write(JSON.stringify(data));
        req.end();
    });
}
function APIError(message) {
    return {
        status: 3,
        status_message: message,
        chat_hostname: 'Ant',
    };
}
