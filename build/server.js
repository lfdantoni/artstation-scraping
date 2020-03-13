"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const config_1 = require("./config");
const container_1 = require("./ioc/container");
const types_1 = require("./ioc/constants/types");
const controllers_1 = require("./ioc/constants/controllers");
const db_1 = require("./models/db");
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
// tslint:disable-next-line: no-var-requires
require('dotenv').config();
const staticUserAuth = express_basic_auth_1.default({
    users: {
        [process.env.ADM_USER]: process.env.ADM_PASS
    },
    challenge: false
});
db_1.MongooseDB.connect()
    .then(() => {
    const app = express_1.default();
    const port = process.env.PORT || 5000;
    app.use('/downloads', express_1.default.static(path_1.join(__dirname, config_1.Config.localFolderDownload)));
    app.use('/assets', express_1.default.static(path_1.join(__dirname, config_1.Config.assetsFolder)));
    app.use(express_1.default.json());
    const authRouter = container_1.appContainer.getNamed(types_1.TYPES.Controller, controllers_1.CONTROLLER_TAGS.Authorize);
    const processRouter = container_1.appContainer.getNamed(types_1.TYPES.Controller, controllers_1.CONTROLLER_TAGS.Process);
    app.use(authRouter.path, authRouter.router);
    app.use(processRouter.path, staticUserAuth, processRouter.router);
    // tslint:disable-next-line: no-console
    app.listen(port, () => console.log(`Example app listening on port ${port}! -> http://localhost:${port}`));
});
