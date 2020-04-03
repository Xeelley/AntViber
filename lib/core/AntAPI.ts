import { AntCore } from './AntCore';

import * as AntTypes from './types';

import * as T from './t';


export class AntAPI extends AntCore {

    public api: AntTypes.ViberAPI;

    constructor(authToken: string, name: string, avatar: string, config: T.AntViberConfig) {
        super(authToken, name, avatar, config)

        this.api = {
            getBotProfile: this._getBotProfile.bind(this),
        }
    }

    private _getBotProfile(): Promise<AntTypes.BotProfile> {
        return new Promise<AntTypes.BotProfile>((resolve, reject) => {
            return this.fallPromise(resolve, reject, this.$api.getBotProfile())
        })
    }

    private fallPromise(resolve: (value: any) => any, reject: (reason: any) => any, method: Promise<any>) {
        method.then(resolve).catch(reject)
    }
}