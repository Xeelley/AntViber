"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AntAPI_1 = require("./core/AntAPI");
class AntViber extends AntAPI_1.AntAPI {
    constructor(authToken, name, avatar, config) {
        super(authToken, name, avatar, config);
    }
    add(type, status, listener) {
        if (!this.botListeners[type])
            this.botListeners[type] = {};
        this.botListeners[type][status] = listener;
    }
}
exports.AntViber = AntViber;
