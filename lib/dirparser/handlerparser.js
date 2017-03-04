const { basename, extname } = require('path');

const mime = require('mime-types');

const handlerExtensionWhitelist = [
    '.css',
    '.csv',
    '.gif',
    '.html',
    '.jpg',
    '.js',
    '.json',
    '.jsonl',
    '.jsonp',
    '.png',
    '.svg',
    '.txt',
    '.xml',
    '.yaml',
];

function isAllowedHandler(path) {
    return handlerExtensionWhitelist.includes(extname(path));
}

function prettyName(fullName) {
    const base = fullName.split('.').shift();
    return base.replace(/[_-]/g, ' ');
}

// fixme: More handler type parsing. Types?
// static, script, redirect, proxy, 

function handlersFromPath(path) {
    const name = basename(path);
    const methods = inferMethods(name);
    const handler = {
        name,
        path,
        prettyName: prettyName(name),
        isDefaultHandler: inferDefault(name),
        status: inferStatusCode(name),
         // fixme: presumably this is not needed, or should be handler type, not file type
        type: inferType(name),
        // thus delete above, rename below.
        handlerType: getHandlerType(name),
        mimeType: inferMimeType(name),
    };
    return methods.map(method => Object.assign({ method }, handler));
}

function inferMethods(filename, defaultMethod = 'GET') {
    // fixme: infers filename "head.js" is a HEAD request etc
    // maybe fixed with required uppercase
    // fixme: should handler support multiple methods? Probably
    const knownMethods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];
    const methods = filename.split('.').filter(e => knownMethods.includes(e));
    return methods.length ? methods : [defaultMethod];
}

/**
 * Returns the mime for file name, or null if no mime type.
 * @param {string} filename 
 */
function inferMimeType(filename) {
    return mime.lookup(filename);
}

/**
 * Return the status code of the response a file name represents.
 * 
 * @param {string} filename 
 * @param {number} [defaultStatus=200]
 */
function inferStatusCode(filename, defaultStatus = 200) {
    const match = filename.match(/\.(\d{3})(?:\.|$)/);
    return match ? Number(match[1]) : defaultStatus;
}

function inferType(filename, defaultType = 'text') {
    const parts = filename.split('.');
    const extension = parts.pop();
    return extension || defaultType;
}

// fixme: lal
function getHandlerType(filename) {
    return 'static';
}

function inferDefault(filename) {
    return /\.default(?:\.|$)/.test(filename);
}

module.exports = {
    handlersFromPath,
    isAllowedHandler,
};
