const { basename } = require('path');
const { readFileSync } = require('fs');

const mime = require('mime-types');

function prettyName(fullName) {
    const base = fullName.split('.').shift();
    return base.replace(/[_-]/g, ' ');
}

function handlersFromPath(path) {
    const name = basename(path);
    const methods = inferMethods(name);
    const extension = inferExtension(name);
    const handlerType = getHandlerType(name);

    let proxyUrl = null;
    if (handlerType === 'proxy') {
        proxyUrl = readFileSync(path, 'utf-8').trim();
    }

    const handler = {
        name,
        path,
        prettyName: prettyName(name),
        isDefaultHandler: inferDefault(name),
        status: inferStatusCode(name),
        extension,
        mimeType: mime.lookup(extension),
        handlerType,
        proxyUrl,
        delay: inferDelay(name),
    };
    return methods.map(method => Object.assign({ method }, handler));
}

function inferMethods(filename, defaultMethod = 'GET') {
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

    if (last === 'js' && mime.lookup(penultimate)) {
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
    const re = /\.delay-(\d+)(ms|s)?\./;
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

module.exports = {
    handlersFromPath,
    // visible for testing:
    getHandlerType,
    inferDefault,
    inferMethods,
    inferStatusCode,
    inferExtension,
    inferDelay,
};
