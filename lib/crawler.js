const { resolve, basename } = require('path');

const directoryTree = require('directory-tree');

const { handlerFromPath, isAllowedHandler } = require('./handlers');

const isDir = root => !!root.children;

const isFile = root => !isDir(root);

const fileChildren = root => isDir(root) ? root.children.filter(isFile) : [];

const dirChildren = root => isDir(root) ? root.children.filter(isDir) : [];

const isWildcardPath = path => basename(path).toUpperCase() === basename(path);

function parseDir(root) {
    return {
        segmentName: root.name.toLowerCase(), // fixme: wildcard rename
        isWildcard: isWildcardPath(root.path),
        wildcardName: (
            isWildcardPath(root.path) ? root.name.toLowerCase() : null
        ),
        handlers: fileChildren(root)
            .filter(e => isAllowedHandler(e.path))
            .map(e => handlerFromPath(e.path)),
        children: dirChildren(root)
            .map(parseDir)
            .sort((a, b) => a.isWildcard - b.isWildcard) // sorted for specificity
    };
}

function parseFileSystem(rootPath) {
    // fixme path prefix not include root dir?
    // fixme: assert on extant path
    const tree = directoryTree(rootPath);
    return parseDir(tree);
}

module.exports.crawl = parseFileSystem;
