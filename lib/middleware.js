const express = require('express');

function hasHandlers(root) {
    return Object.keys(root.handlers).length !== 0;
}

function executeHandler(root, res) {
    res.status(root.status).sendFile(root.path);
    return root;
}

class MockServer {
    constructor(tree) {
        this.tree = tree;
        this.routes = [];
    }

    getRoutesList() {
    }

    router() {
        const router = express.Router();
        this.addRoutesForBranch('', this.tree, router);
        return router;
    }

    addRoutesForBranch(prefix, branch, router) {
        let herePath;
        if (branch.isWildcard) {
            herePath = `${prefix}/:${branch.segmentName}`;
        }
        else {
            herePath = `${prefix}/${branch.segmentName}`;
        }

        if (hasHandlers(branch)) {
            Object.keys(branch.handlers).forEach(method => {
                this.routes.push([method, herePath]);
                router[method.toLowerCase()](herePath, (req, res) => {
                    executeHandler(branch.handlers[method][0], res);
                    // res.status(200).send('ok: ' + herePath);
                });
            });
        }

        branch.children.forEach(e => {
            this.addRoutesForBranch(herePath, e, router);
        });
    }
}

module.exports.MockServer = MockServer;
