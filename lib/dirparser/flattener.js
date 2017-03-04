function flattenBranch(prefix, branch, target, isRoot = false) {
    let herePath;
    if (isRoot) {
        herePath = '';
    }
    else if (branch.isWildcard) {
        herePath = `${ prefix }/:${ branch.segmentName }`;
    }
    else {
        herePath = `${ prefix }/${ branch.segmentName }`;
    }

    if (branch.handlers.length) {
        target.push([herePath == '' ? '/' : herePath, branch.handlers]);
    }

    branch.children.forEach(e => flattenBranch(herePath, e, target));
}

function flattenTree(tree) {
    // fixme: don't use target?
    const target = [];
    flattenBranch('', tree, target, true);
    return target;
}

function handlerSorter(ha, hb) {
    if (ha.status !== hb.status) {
        return ha.status - hb.status;
    }
    else {
        if (ha.name > hb.name) {
            return -1;
        }
        else if (ha.name < hb.name) {
            return 1;
        }
        else {
            return 0;
        }
    }
}

function flattenProperly(tree) {
    let rid = 0;
    const nested = flattenTree(tree).map(([path, handlers]) => {
        let hid = 1;
        const methods = new Set(handlers.map(e => e.method));
        return Array.from(methods).map(methodName => {
            rid++;
            return {
                path,
                method: methodName,
                handlers: handlers
                    .filter(e => e.method === methodName)
                    .sort(handlerSorter)
                    .map(e => Object.assign(e, {
                        routeId: `r${ rid }`,
                        handlerId: `r${ rid }h${ hid++ }`,
                    })),
                routeId: `r${ rid }`,
            };
        });
    });
    return [].concat(...nested);
}

module.exports.flatten = flattenProperly;
