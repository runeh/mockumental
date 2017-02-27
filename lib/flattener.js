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
    // fixme: don't use target?
    const target = [];
    flattenBranch('', tree, target);
    return target;
}

function flattenProperly(tree) {
    let rid = 0;
    const nested = flattenTree(tree).map(([path, handlers]) => {
        rid++;
        let hid = 1;
        const methods = new Set(handlers.map(e => e.method));
        return Array.from(methods).map(methodName => ({
            path,
            method: methodName,
            handlers: handlers
                .filter(e => e.method === methodName)
                .map(e => Object.assign(e, {
                    routeId: rid,
                    handlerId: hid++
                })),
            routeId: rid
        }));
    });
    return [].concat(...nested);
}

module.exports.flatten = flattenProperly;
