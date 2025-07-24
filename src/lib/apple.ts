export function isIOS(): boolean {
    return typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
}