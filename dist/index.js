"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var AntCore_1 = require("./core/AntCore");
var AntViber = (function (_super) {
    __extends(AntViber, _super);
    function AntViber(authToken, name, avatar, config) {
        return _super.call(this, authToken, name, avatar, config) || this;
    }
    AntViber.prototype.add = function (type, status, listener) {
        if (!this.botListeners[type])
            this.botListeners[type] = {};
        this.botListeners[type][status] = listener;
    };
    return AntViber;
}(AntCore_1.AntCore));
exports.AntViber = AntViber;
