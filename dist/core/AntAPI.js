"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AntCore_1 = require("./AntCore");
class AntAPI extends AntCore_1.AntCore {
    constructor(authToken, name, avatar, config) {
        super(authToken, name, avatar, config);
        this.api = {
            getBotProfile: this._getBotProfile.bind(this),
        };
    }
    _getBotProfile() {
        return new Promise((resolve, reject) => {
            return this.fallPromise(resolve, reject, this.$api.getBotProfile());
        });
    }
    fallPromise(resolve, reject, method) {
        method.then(resolve).catch(reject);
    }
}
exports.AntAPI = AntAPI;
