const express = require('express');
const bodyParser = require('body-parser');


const { Mockumental } = require('../index');

const { adminPage } = require('./templates');

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

    _handleAdminGet(req, res) {
        res.send(adminPage('title', this._mocker.getRoutes(), this.getSelectedHandlers()));
    }

    _handleAdminPost(req, res) {
        const { rid, hid } = req.body;
        this._mocker.setHandler(rid, hid);
        this._handleAdminGet(req, res);
    }

    _makeRouter() {
        const router = express.Router();
        router.use(bodyParser.urlencoded({ extended: true }))

        router.get('/__admin', (req, res, next) => {
            this._handleAdminGet(req, res, next);
        });
        router.post('/__admin', (req, res, next) => {
            this._handleAdminPost(req, res, next);
        });
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
