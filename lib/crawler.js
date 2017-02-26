const { resolve } = require('path');

const directoryTree = require('directory-tree');

const handlerExtensionWhitelist = [
    'css', 'csv', 'gif', 'html', 'jpg', 'js', 'json', 'jsonl', 'jsonp', 'png',
    'svg', 'txt', 'xml', 'yaml'
];

function dictPartition(bucketFun, items) {
    const ret = {};
    items.forEach(item => {
        const bucket = bucketFun(item);
        ret[bucket] = ret[bucket] || [];
        ret[bucket].push(item);
    });
    return ret;
}

function isAllowedHandlerFile(root, whitelist = handlerExtensionWhitelist) {
    const extension = root.name.split('.').pop().toLowerCase();
    return whitelist.includes(extension);
}

function isDir(root) {
    return !!root.children;
}

function isFile(root) {
    return !isDir(root);
}

function childHandlers(root) {
    return isDir(root) ? root.children.filter(isFile).filter(e => isAllowedHandlerFile(e)) : [];
}

function childDirs(root) {
    return isDir(root) ? root.children.filter(isDir) : [];
}

function isWildcardPath(root) {
    return root.name.toUpperCase() === root.name;
}

function parseDir(root) {
    return {
        segmentName: root.name.toLowerCase(), // fixme: wildcard rename
        isWildcard: isWildcardPath(root),
        wildcardName: isWildcardPath(root) ? root.name.toLowerCase() : null,
        handlers: dictPartition(e => e.method, childHandlers(root).map(parseHandler)),
        children: childDirs(root)
            .map(parseDir)
            .sort((a, b) => a.isWildcard - b.isWildcard), // sorted for specificity
    }
}

function parseHandler(root) {
    return {
        name: root.name,
        status: inferStatusCode(root.name),
        method: inferMethod(root.name),
        type: inferType(root.name),
        path: root.path,
    }
}

function inferMethod(filename, defaultMethod = 'GET') {
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'INFO'];
    const parts = filename.toUpperCase().split('.');
    for (part of parts) {
        if (methods.includes(part)) {
            return part;
        }
    }
    return defaultMethod;
}

function inferStatusCode(filename, defaultStatus = 200) {
    const match = filename.match(/\.(\d{3})(?:\.|$)/);
    return (match && Number(match[1])) || defaultStatus;
}

function inferType(filename, defaultType = 'text') {
    const parts = filename.split('.');
    const extension = parts.pop();
    return extension;
}

function parseFileSystem(rootPath) {
    const tree = directoryTree(rootPath);
    return parseDir(tree);
}

module.exports.crawl = parseFileSystem;