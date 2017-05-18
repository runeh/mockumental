const express = require('express');
const bodyParser = require('body-parser');

const { Mockumental } = require('../index');

const { adminPage } = require('./templates');

class ExpressMockumental {
    constructor(rootPath, options) {
        this._mocker = new Mockumental(rootPath, options);
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
        const activated = this._mocker.activateHandler(hid);
        if (activated) {
            this._handleAdminGet(req, res);
        }
        else {
            res.status(400).json({ error: `hid not found: ${ hid }` });
        }
    }

    _makeRouter() {
        const router = express.Router();
        router.use(bodyParser.urlencoded({ extended: true }))

        router.get('/__admin', (req, res, next) => {
            this._handleAdminGet(req, res);
        });
        router.post('/__admin', (req, res, next) => {
            this._handleAdminPost(req, res);
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
        return this._mocker.activateHandler(hid);
    }
}

module.exports.ExpressMockumental = ExpressMockumental;
