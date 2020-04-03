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
        if ($k.backgroundColor)
            result.keyboardSettings.frameColor = $k.frameColor;
        if ($k.backgroundColor)
            result.keyboardSettings.buttonColor = $k.buttonColor;
        if ($k.backgroundColor)
            result.keyboardSettings.BorderWidth = $k.BorderWidth;
    }
    return result;
}
exports.Config = Config;
