import { AntCore } from './AntCore';

import * as AntTypes from './types';

import * as T from './t';


export class AntAPI extends AntCore {

    public api: AntTypes.ViberAPI;

    constructor(authToken: string, name: string, avatar: string, config: T.AntViberConfig) {
        super(authToken, name, avatar, config)

        this.api = {
            getBotProfile: this._getBotProfile.bind(this),
            getUserDetails: this._getUserDetails.bind(this),
            getOnlineStatus: this._getOnlineStatus.bind(this),
            onConversationStarted: this._onConversationStarted.bind(this),
            onSubscribe: this._onSubscribe.bind(this),
            onUnsubscribe: this._onUnsubscribe.bind(this),
        }
    }

    private _getBotProfile(): Promise<AntTypes.BotProfile> {
        return new Promise<AntTypes.BotProfile>((resolve, reject) => {
            return this.fallPromise(resolve, reject, this.$api.getBotProfile())
        })
    }

    private _getUserDetails(user: T.ViberUserProfile): Promise<AntTypes.BotUserDetails> {
        return new Promise<AntTypes.BotUserDetails>((resolve, reject) => {
            return this.fallPromise(resolve, reject, this.$api.getUserDetails(user))
        })
    }

    private _getOnlineStatus(ids: string[]): Promise<AntTypes.BotOnlineStatus> {
        return new Promise<AntTypes.BotOnlineStatus>((resolve, reject) => {
            return this.fallPromise(resolve, reject, this.$api.getOnlineStatus(ids))
        })
    }

    private _onConversationStarted(handler: AntTypes.onConversationStartedHandler): void {
        this.$api.onConversationStarted(handler)
    }

    private _onSubscribe(handler: AntTypes.OnSubscribeHandler): void {
        this.$api.onSubscribe(handler)
    }

    private _onUnsubscribe(handler: AntTypes.OnUnsubscribeHandler): void {
        this.$api.onUnsubscribe(handler)
    }


    private fallPromise(resolve: (value: any) => any, reject: (reason: any) => any, method: Promise<any>) {
        method.then(resolve).catch(reject)
    }
}