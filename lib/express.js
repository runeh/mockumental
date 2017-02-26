const { resolve } = require('path');
const express = require('express');

// }
// function hasHandlers(root) {
//     return Object.keys(root.handlers).length !== 0;

// function isRequireable(path) {
//     path = path.toLowerCase();
//     return path.endsWith('.js') || path.endsWith('.json');
// }

// function executeHandler(root, res) {
//     res.status(root.status).sendFile(root.path);
//     return root;
// }

// class MockServer {
//     constructor(tree) {
//         this.tree = tree;
//         this.routes = [];
//     }

//     getRoutesList() {
//     }

//     router() {
//         const router = express.Router();
//         this.addRoutesForBranch('', this.tree, router);
//         return router;
//     }

//     addRoutesForBranch(prefix, branch, router) {
//         let herePath;
//         if (branch.isWildcard) {
//             herePath = `${prefix}/:${branch.segmentName}`;
//         } else {
//             herePath = `${prefix}/${branch.segmentName}`;
//         }

//         if (hasHandlers(branch)) {
//             Object.keys(branch.handlers).forEach(method => {
//                 this.routes.push([method, herePath]);
//                 router[method.toLowerCase()](herePath, (req, res, next) => {
//                     executeHandler(branch.handlers[method][0], res);
//                     // res.status(200).send('ok: ' + herePath);
//                 });
//             });
//         }

//         branch.children.forEach(e => {
//             this.addRoutesForBranch(herePath, e, router);
//         });
//     }
// }

const { crawl } = require('./crawler');
const { flattenWithMethod } = require('./flattener');

const pairs = obj => Object.keys(obj).map(e => [e, obj[e]]);

function attachPathRoutes(router, paths) {
    paths.forEach(([path, methodMap]) => {
        attachMethodRoutes(router, path, methodMap);
    });
}

function attachMethodRoutes(router, path, methodMap) {
    pairs(methodMap).forEach(([method, handlers]) => {
        console.log('jarra', method, path);
        const methodName = method.toLowerCase();
        router[methodName](path, (req, res, next) => {
            console.log('jau', path, method);
            res.status(200).send(`${method} : ${path}`);
        });
    });
}

function middleware(path) {
    const paths = flattenWithMethod(crawl(resolve(path)));
    const router = express.Router();
    attachPathRoutes(router, paths);
    return {
        router
    };
}

module.exports.middleware = middleware;
