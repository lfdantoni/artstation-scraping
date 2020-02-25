"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class ProcessRoute {
    constructor() {
        this.path = '/process';
        this.router = express_1.Router();
        this.config();
    }
    enqueueProcess(req, resp) {
        resp.json({
            resp: 'process ' + req.body.artistId
        });
    }
    config() {
        this.router.post('/', this.enqueueProcess);
    }
}
const processRoute = new ProcessRoute();
exports.default = processRoute;
