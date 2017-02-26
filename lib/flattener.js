function flattenBranch(prefix, branch, target) {
    let herePath;
    if (branch.isWildcard) {
        herePath = `${prefix}/:${branch.segmentName}`;
    } else {
        herePath = `${prefix}/${branch.segmentName}`;
    }

    if (branch.handlers.length) {
        target.push([herePath, branch.handlers]);
    }

    branch.children.forEach(e => flattenBranch(herePath, e, target));
}

function flattenTree(tree) {
    const target = [];
    flattenBranch('', tree, target);
    return target;
}

function dictPartition(bucketFun, items) {
    const ret = {};
    items.forEach(item => {
        const bucket = bucketFun(item);
        ret[bucket] = ret[bucket] || [];
        ret[bucket].push(item);
    });
    return ret;
}

function methodHandlers(handlers) {
    return dictPartition(e => e.method, handlers);
}

function flattenWithMethod(tree) {
    return flattenTree(tree).map(([path, handlers]) => [
        path,
        methodHandlers(handlers)
    ]);
}

module.exports.flatten = flattenTree;
module.exports.flattenWithMethod = flattenWithMethod;
