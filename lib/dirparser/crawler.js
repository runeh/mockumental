const { basename } = require('path');

const directoryTree = require('directory-tree');

const { handlersFromPath, isAllowedHandler } = require('./handlerparser');

const isDir = root => !!root.children;

const isFile = root => !isDir(root);

const fileChildren = root => isDir(root) ? root.children.filter(isFile) : [];

const dirChildren = root => isDir(root) ? root.children.filter(isDir) : [];

const isWildcardPath = path => basename(path).toUpperCase() === basename(path);

const flattener = (acc, cur) => acc.concat(cur);

function parseDir(root) {
    return {
        segmentName: root.name.toLowerCase(),
        isWildcard: isWildcardPath(root.path),
        wildcardName: (
            isWildcardPath(root.path) ? root.name.toLowerCase() : null
        ),
        handlers: fileChildren(root)
            .filter(e => isAllowedHandler(e.path))
            .map(e => handlersFromPath(e.path))
            .reduce(flattener, []),
        children: dirChildren(root)
            .map(parseDir)
            .sort((a, b) => a.isWildcard - b.isWildcard), // sorted for specificity
    };
}

function parseFileSystem(rootPath) {
    const tree = directoryTree(rootPath);
    return parseDir(tree);
}

module.exports.crawl = parseFileSystem;
