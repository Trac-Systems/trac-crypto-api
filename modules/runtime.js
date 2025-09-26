function isNode() {
    if (typeof global === 'undefined') return false;
    const proc = global.process;
    return typeof proc !== 'undefined' && proc !== null && proc.versions != null && proc.versions.node != null;
}

function isBare() {
    if (typeof global === 'undefined') return false;
    return global.Bare !== undefined || global.Pear !== undefined;
}

function isBrowser() {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined'
}

module.exports = {
    isNode,
    isBare,
    isBrowser
};