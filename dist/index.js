"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AntCore_1 = require("./core/AntCore");
class AntViber extends AntCore_1.AntCore {
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
