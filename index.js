const directoryTree = require('directory-tree');
const wayfarer = require('wayfarer');

function isDir(root) {
    return !!root.children;
}

function isFile(root) {
    return !isDir(root);
}

function dirHandlers(root) {
    return isDir(root) ? root.children.filter(isFile) : [];
}

function childrenOf(root) {
    return isDir(root) ? root.children.filter(isDir) : [];
}

function isWildcardPath(root) {
    return root.name.toUpperCase() === root.name;
}

function makeHandlerFor(root) {
    return (a, b) => {
        console.log(`got hit on /${root.name}`, a, b);
        // console.log("should use one of")
        // console.log(dirHandlers(root));            
    }
}

function walkDir(root) {
    const router = wayfarer();
    console.log('walking into', root.name, root.path);

    if (isWildcardPath(root)) {
        router.on(`:${root.name.toLowerCase()}`, makeHandlerFor(root));
    } else {
        const name = root.name.replace('_', '.');
        router.on(name, makeHandlerFor(root));
    }

    childrenOf(root).map(walkDir).filter(Boolean).forEach(childRouter => {
        router.on(`${root.name}`, childRouter);
    });

    return router;
}

function createRouter(rootPath) {
    const tree = directoryTree(rootPath);
    return walkDir(tree);
}

const router = createRouter('./example');

// router('/example', 1111);
// router('/example/searches', 1112);
// router('/example/what', 1113);
// router('/example/searches/foobar', 1114);
router('/example/unreadcount_json', 1114);
// router('/example/user/rune/nokia', 1114);