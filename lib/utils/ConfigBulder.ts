import * as T from '../core/t';

const defaultConfig: T.AntViberConfig = {
    getStatus: (user: string) => Promise.resolve(''),
    setStatus: (user: string, status: string) => Promise.resolve(),
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
}

export function Config(config: T.AntViberConfig) {
    const result = defaultConfig;

    result.getStatus = config.getStatus;
    result.setStatus = config.setStatus;

    if (config.maskSeparator)            result.maskSeparator            = config.maskSeparator;
    if (config.richPayloadPrefix)        result.richPayloadPrefix        = config.richPayloadPrefix;
    if (config.startButtonText)          result.startButtonText          = config.startButtonText;
    if (config.richPayloadDataSeparator) result.richPayloadDataSeparator = config.richPayloadDataSeparator;

    if (config.autoStartMessage !== undefined) result.autoStartMessage = config.autoStartMessage;

    const $k = config.keyboardSettings;
    if ($k) {
        if ($k.backgroundColor) result.keyboardSettings.backgroundColor = $k.backgroundColor;
        if ($k.frameColor)      result.keyboardSettings.frameColor      = $k.frameColor;
        if ($k.buttonColor)     result.keyboardSettings.buttonColor     = $k.buttonColor;
        if ($k.BorderWidth)     result.keyboardSettings.BorderWidth     = $k.BorderWidth;
    }

    const $r = config.retryRequest;
    if ($r) {
        if ($r.enable)   result.retryRequest.enable   = $r.enable;
        if ($r.retries)  result.retryRequest.retries  = $r.retries;
        if ($r.interval) result.retryRequest.interval = $r.interval;
    }

    return result;
}