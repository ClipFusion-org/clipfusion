import { useState, useEffect } from 'react';

type Engine = 'Blink' | 'WebKit' | 'Gecko' | 'Trident' | 'Unknown';

// small hook for detecting browser's rendering engine (blink, webkit etc.)
// makes applying browser-specific workarounds easier
// for example you can use it to fix blurry text on chrome when using transform (css property)

const useBrowserEngine = (): Engine => {
    const [engine, setEngine] = useState<Engine>('Unknown');

    useEffect(() => {
        const ua = navigator.userAgent;

        if (/Trident|MSIE/.test(ua)) {
            setEngine('Trident');
        } else if (/Firefox/.test(ua)) {
            setEngine('Gecko');
        } else if (/Edge/.test(ua) || (/Chrome/.test(ua) && /Safari/.test(ua) && !/OPR/.test(ua))) {
            setEngine('Blink');
        } else if (/Safari/.test(ua) && !/Chrome/.test(ua)) {
            setEngine('WebKit');
        } else if (/AppleWebKit/.test(ua)) {
            // covers some Chrome-based UAs that don’t explicitly list Google Inc vendor
            setEngine('Blink');
        } else if (/Opera/.test(ua) || /OPR/.test(ua)) {
            setEngine('Blink');
        } else {
            setEngine('Unknown');
        }
    }, []);

    return engine;
}

export default useBrowserEngine;