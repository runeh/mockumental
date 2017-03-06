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
        this._mocker
            .handle(req.path, req.method, req)
            .then(handlerRes => {
                if (handlerRes) {
                    res
                        .status(handlerRes.status)
                        .type(handlerRes.mimeType || 'text')
                        .header(handlerRes.headers)
                        .send(handlerRes.body);
                }
                else {
                    next();
                }
            });
    }

    _sendHtml(req, res) {
        res.send(adminPage(this._mocker.getRoutes(), req.baseUrl));
    }

    _sendJson(req, res) {
        res.status(200).json(this._mocker.getRoutes());
    }

    _handleAdminGet(req, res) {
        res.format({
            default: () => this._sendJson(req, res),
            json: () => this._sendJson(req, res),
            html: () => this._sendHtml(req, res),
        });
    }

    _handleAdminPost(req, res) {
        const { hid } = req.body;
        this._mocker.activateHandler(hid);
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


    activateHandler(hid) {
        this._mocker.activateHandler(hid);
    }
}

module.exports.ExpressMockumental = ExpressMockumental;
