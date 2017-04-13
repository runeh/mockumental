const { basename } = require('path');
const { readFileSync } = require('fs');

const mime = require('mime-types');

const { METHODS: validMethods } = require('http');

function prettyName(fullName) {
    const base = fullName.split('.').shift();
    return base.replace(/[_-]/g, ' ');
}

function handlersFromPath(path) {
    const name = basename(path);
    const handlerType = getHandlerType(name);

    const handlerInfo = parseFileName(path);

    if (handlerType === 'proxy') {
        handlerInfo.proxyUrl = readFileSync(path, 'utf-8').trim();
    }
    else {
        handlerInfo.proxyUrl = null;
    }

    const methods = handlerInfo.methods;
    delete handlerInfo.methods;

    return methods.sort().map(method => {
        return Object.assign({}, handlerInfo, { name, path, method });
    });
}

function inferMethods(filename, defaultMethod = 'GET') {
    const methods = filename.split('.').filter(e => validMethods.includes(e));
    return methods.length ? methods : [defaultMethod];
}

/**
 * Return the status code of the response a file name represents.
 * 
 * @param {string} filename 
 * @param {number} [defaultStatus=200]
 */
function inferStatusCode(filename, defaultStatus = 200) {
    const statusRegex = new RegExp('^\\d\\d\\d$');
    const statusCodes = filename
        .split('.')
        .filter(e => statusRegex.test(e))
        .map(Number);
    
    if (statusCodes.length === 0) {
        return defaultStatus;
    }
    else if (statusCodes.length === 1) {
        return statusCodes[0];
    }
    else {
        throw new Error(`File name contains multiple status codes. Must be only one: "${ filename } "`);
    }
}

function inferExtension(filename) {
    const parts = filename.toLowerCase().split('.');
    if (parts.length < 2) {
        return null; // presumably this should never happen?
    }

    const [penultimate, last] = parts.slice(-2);

    if (last === 'js' && mime.lookup(penultimate)) {
        return penultimate;
    }
    else if (last === 'static' && mime.lookup(penultimate)) {
        return penultimate;
    }
    else if (mime.lookup(last)) {
        return last;
    }
    else {
        return null;
    }
}

function getHandlerType(filename) {
    const parts = filename.split('.');
    const last = parts.pop();
    const penultimate = parts.pop();

    if (last === 'js' && mime.lookup(penultimate)) {
        return 'script';
    }
    else if (last === 'static' && mime.lookup(penultimate)) {
        return 'static';
    }
    else if (mime.lookup(last)) {
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

function inferDelay(filename) {
    const re = /\.delay-?(\d+)(ms|s)?\./;
    const match = re.exec(filename);
    if (match) {
        let millis = Number(match[1]);
        if (match[2] === 's') {
            millis = millis * 1000;
        }
        return millis;
    }
    else {
        return 0;
    }
}

function inferHid(filename) {
    const re = /\.hid-(.+?)\./;
    const match = re.exec(filename);
    return match ? match[1] : null;
}

function parseFileName(filename) {
    const name = basename(filename);
    const methods = inferMethods(name);
    const extension = inferExtension(name);
    const handlerType = getHandlerType(name);

    return {
        handlerType,
        methods,
        prettyName: prettyName(name),
        isDefaultHandler: inferDefault(name),
        status: inferStatusCode(name),
        mimeType: mime.lookup(extension),
        delay: inferDelay(name),
        handlerId: inferHid(name),
    };
}

module.exports = {
    handlersFromPath,
    parseFileName,

    // visible for testing:
    getHandlerType,
    inferDefault,
    inferMethods,
    inferStatusCode,
    inferExtension,
    inferDelay,
    inferHid,
};
