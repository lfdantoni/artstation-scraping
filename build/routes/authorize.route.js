"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable: no-console
const express_1 = require("express");
const inversify_1 = require("inversify");
const file_manager_helper_1 = require("../helpers/file-manager.helper");
const types_1 = require("../ioc/constants/types");
const gdrive_service_1 = require("../services/gdrive.service");
const goauth_service_1 = require("../services/goauth.service");
const users_service_1 = require("../services/users.service");
let AuthorizeRoute = class AuthorizeRoute {
    constructor(oauthService, gDriveService, userService) {
        this.oauthService = oauthService;
        this.gDriveService = gDriveService;
        this.userService = userService;
        this.path = '/authorize';
        // TODO replace it for DB
        this.tokenPath = 'tokens.json';
        this.validateCode = async (req, resp) => {
            const protocol = process.env.ENVIRONMENT === 'local' ? 'http' : 'https';
            const fullReqUrl = protocol + '://' + req.get('host') + this.path;
            console.log(fullReqUrl);
            console.log(req.query.code);
            if (req.query.code) {
                const token = await this.oauthService.getToken(req.query.code, fullReqUrl);
                file_manager_helper_1.FileManagerHelper.saveJsonFile(this.tokenPath, token);
                console.log(token);
                // TODO add logic to check if I've received the refresh_token
                this.oauthService.setCredentials(token);
                const userInfo = this.oauthService.getUserInfo() || {};
                const userSaved = await this.userService.createOrUpdateUser({
                    name: userInfo.name,
                    email: userInfo.email,
                    gId: userInfo.sub,
                    credential: token
                });
                resp.json(userSaved);
            }
            else {
                console.log(this.oauthService.getAuthUrl(fullReqUrl));
                resp.redirect(this.oauthService.getAuthUrl(fullReqUrl));
            }
        };
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', this.validateCode);
    }
};
AuthorizeRoute = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.OAuth)),
    __param(1, inversify_1.inject(types_1.TYPES.FileStorage)),
    __param(2, inversify_1.inject(types_1.TYPES.UserService)),
    __metadata("design:paramtypes", [goauth_service_1.GOAuthService,
        gdrive_service_1.GDriveService,
        users_service_1.UserService])
], AuthorizeRoute);
exports.AuthorizeRoute = AuthorizeRoute;
