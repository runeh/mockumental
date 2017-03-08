const { basename, extname } = require('path');
const { readFileSync } = require('fs');

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
    '.proxy',
    '.svg',
    '.txt',
    '.xml',
    '.yaml',
];

const staticExtensions = [
    'css',
    'csv',
    'gif',
    'html',
    'jpg',
    'js',
    'json',
    'jsonl',
    'jsonp',
    'png',
    'svg',
    'txt',
    'xml',
    'yaml',
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
    const extension = inferExtension(name);
    const handlerType = getHandlerType(name);
    // console.log("the proxy path", path);
    // console.log("the proxy type", handlerType);

    let proxyUrl = null;
    if (handlerType === 'proxy') {
        // fixme: sanity check pthat proxyUrl is an url
        proxyUrl = readFileSync(path, 'utf-8').trim();
    }

    const handler = {
        name,
        path,
        prettyName: prettyName(name),
        isDefaultHandler: inferDefault(name),
        status: inferStatusCode(name),
         // fixme: presumably this is not needed, or should be handler type, not file type
        type: inferType(name),
        // thus delete above, rename below.
        extension,
        mimeType: mime.lookup(extension),
        handlerType,
        proxyUrl,
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
 * Return the status code of the response a file name represents.
 * 
 * @param {string} filename 
 * @param {number} [defaultStatus=200]
 */
function inferStatusCode(filename, defaultStatus = 200) {
    const match = filename.match(/(?:^|\.)(\d{3})(?:\.|$)/);
    return match ? Number(match[1]) : defaultStatus;
}

function inferExtension(filename) {
    const parts = filename.toLowerCase().split('.');
    if (parts.length < 2) {
        return null; // presumably this should never happen?
    }

    const [penultimate, last] = parts.slice(-2);

    // fixme: should assert be based on the handlerType? These two are
    // two sides of the same coin.
    if (last === 'js' && staticExtensions.includes(penultimate)) {
        return penultimate;
    }
    else if (staticExtensions.includes(last)) {
        return last;
    }
    else {
        return null;
    }
}

function inferType(filename, defaultType = 'text') {
    const parts = filename.split('.');
    const extension = parts.pop();
    return extension || defaultType;
}

// fixme: pass in whitelist?
function getHandlerType(filename) {
    const parts = filename.split('.');
    const last = parts.pop();
    const penultimate = parts.pop();

    if (last === 'js' && staticExtensions.includes(penultimate)) {
        return 'dynamic';
    }
    else if (staticExtensions.includes(last)) {
        return 'static';        
    }
    else if (last === 'proxy')
        return 'proxy';
    else {
        return null;
    }
}

function inferDefault(filename) {
    return /(?:^|\.)default\./.test(filename);
}

module.exports = {
    handlersFromPath,
    isAllowedHandler,

    // visible for testing:
    getHandlerType,
    inferDefault,
    inferMethods,
    inferStatusCode,
};
