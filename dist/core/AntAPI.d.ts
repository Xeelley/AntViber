import { AntCore } from './AntCore';
import * as AntTypes from './types';
import * as T from './t';
export declare class AntAPI extends AntCore {
    api: AntTypes.ViberAPI;
    constructor(authToken: string, name: string, avatar: string, config: T.AntViberConfig);
    private _getBotProfile;
    private _getUserDetails;
    private _getOnlineStatus;
    private _onConversationStarted;
    private _onSubscribe;
    private _onUnsubscribe;
    private fallPromise;
}
