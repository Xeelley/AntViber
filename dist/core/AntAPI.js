"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AntCore_1 = require("./AntCore");
class AntAPI extends AntCore_1.AntCore {
    constructor(authToken, name, avatar, config) {
        super(authToken, name, avatar, config);
        this.api = {
            getBotProfile: this._getBotProfile.bind(this),
            getUserDetails: this._getUserDetails.bind(this),
            getOnlineStatus: this._getOnlineStatus.bind(this),
            onConversationStarted: this._onConversationStarted.bind(this),
            onSubscribe: this._onSubscribe.bind(this),
            onUnsubscribe: this._onUnsubscribe.bind(this),
        };
    }
    _getBotProfile() {
        return new Promise((resolve, reject) => {
            return this.fallPromise(resolve, reject, this.$api.getBotProfile());
        });
    }
    _getUserDetails(user) {
        return new Promise((resolve, reject) => {
            return this.fallPromise(resolve, reject, this.$api.getUserDetails(user));
        });
    }
    _getOnlineStatus(ids) {
        return new Promise((resolve, reject) => {
            return this.fallPromise(resolve, reject, this.$api.getOnlineStatus(ids));
        });
    }
    _onConversationStarted(handler) {
        this.$api.onConversationStarted(handler);
    }
    _onSubscribe(handler) {
        this.$api.onSubscribe(handler);
    }
    _onUnsubscribe(handler) {
        this.$api.onUnsubscribe(handler);
    }
    fallPromise(resolve, reject, method) {
        method.then(resolve).catch(reject);
    }
}
exports.AntAPI = AntAPI;
