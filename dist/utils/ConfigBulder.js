"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaultConfig = {
    getStatus: (user) => Promise.resolve(''),
    setStatus: (user, status) => Promise.resolve(),
    maskSeparator: ':',
    richPayloadPrefix: '[VCD]',
    startButtonText: 'Start!',
    richPayloadDataSeparator: '$:',
    keyboardSettings: {
        backgroundColor: '#FFFFFF',
        frameColor: '#665CAC',
        buttonColor: '#FFFFFF',
        BorderWidth: 0,
    },
    autoStartMessage: true,
    retryRequest: {
        enable: false,
        retries: 0,
        interval: 100,
    },
};
function Config(config) {
    const result = defaultConfig;
    result.getStatus = config.getStatus;
    result.setStatus = config.setStatus;
    if (config.maskSeparator)
        result.maskSeparator = config.maskSeparator;
    if (config.richPayloadPrefix)
        result.richPayloadPrefix = config.richPayloadPrefix;
    if (config.startButtonText)
        result.startButtonText = config.startButtonText;
    if (config.richPayloadDataSeparator)
        result.richPayloadDataSeparator = config.richPayloadDataSeparator;
    if (config.autoStartMessage !== undefined)
        result.autoStartMessage = config.autoStartMessage;
    const $k = config.keyboardSettings;
    if ($k) {
        if ($k.backgroundColor)
            result.keyboardSettings.backgroundColor = $k.backgroundColor;
        if ($k.frameColor)
            result.keyboardSettings.frameColor = $k.frameColor;
        if ($k.buttonColor)
            result.keyboardSettings.buttonColor = $k.buttonColor;
        if ($k.BorderWidth)
            result.keyboardSettings.BorderWidth = $k.BorderWidth;
    }
    const $r = config.retryRequest;
    if ($r) {
        if ($r.enable)
            result.retryRequest.enable = $r.enable;
        if ($r.retries)
            result.retryRequest.retries = $r.retries;
        if ($r.interval)
            result.retryRequest.interval = $r.interval;
    }
    return result;
}
exports.Config = Config;
