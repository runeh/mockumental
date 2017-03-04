const express = require('express');

const { Mockumental } = require('../index');

// fixme: options? cors etc, outside? Only for cli?

class ExpressMockumental {
    constructor(rootPath) {
        this._mocker = new Mockumental(rootPath);
        this.router = this._makeRouter();
    }

    _handleFun(req, res, next) {
        const handlerRes = this._mocker.handle(req.path, req.method);
        if (handlerRes) {
            res
                .status(handlerRes.status)
                .type(handlerRes.mimeType)
                .send(handlerRes.body);
        }
        else {
            next();
        }
    }

    _makeRouter() {
        const router = express.Router();
        router.all('*', (req, res, next) => {
            this._handleFun(req, res, next);
        });
        return router;
    }

    getRoutes() {
        return this._mocker.getRoutes();
    }

    getSelectedHandlers() {
        // fixme: private
        return this._mocker._selectedHandlers;
    }

    setHandler(routeId, handlerId) {
        return this._mocker.setHandler(routeId, handlerId);
    }
}

module.exports.ExpressMockumental = ExpressMockumental;
