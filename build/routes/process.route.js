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
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../ioc/constants/types");
const artstation_scraping_service_1 = require("../services/artstation-scraping.service");
const gdrive_service_1 = require("../services/gdrive.service");
const users_service_1 = require("../services/users.service");
let ProcessRoute = class ProcessRoute {
    constructor(fileStorage, userService) {
        this.fileStorage = fileStorage;
        this.userService = userService;
        this.path = '/process';
        this.router = express_1.Router();
        this.config();
    }
    async enqueueProcess(req, resp) {
        const { artistId, userId, createRootFolder } = req.body;
        let rootFolderId = '';
        if (!artistId || !userId) {
            resp.status(400);
            resp.json({
                description: 'Invalid user or artist'
            });
            return;
        }
        const userData = await this.userService.getUserWithCredential(userId);
        if (!userData) {
            resp.status(400);
            resp.json({
                description: 'Invalid user'
            });
            return;
        }
        // TODO save the folderId to db
        if (createRootFolder) {
            rootFolderId = await this.fileStorage.createFolder('ArtStationScrapingApp', userData.credential);
        }
        else {
            // TODO remove this
            rootFolderId = '1CWFoXbhTjGKxOaBofIdii7P5v-lbbKqZ';
        }
        const artistFolderId = await this.fileStorage.createFolder(artistId, userData.credential, rootFolderId);
        const serviceOptions = {
            artistId,
            updateCallback: async (state) => {
                if (state.finish) {
                    // tslint:disable-next-line: no-console
                    console.log('downloadGallery: ', state.log);
                    return;
                }
                await this.fileStorage.uploadFile(artistFolderId, state.imagePath, state.imageName, userData.credential);
                // tslint:disable-next-line: no-console
                console.log('downloadGallery: ', state);
            }
        };
        await (new artstation_scraping_service_1.ArtStationScrapingService(serviceOptions)).process();
        resp.json({
            resp: 'process ' + req.body.artistId
        });
    }
    config() {
        this.router.post('/', this.enqueueProcess.bind(this));
    }
};
ProcessRoute = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.FileStorage)),
    __param(1, inversify_1.inject(types_1.TYPES.UserService)),
    __metadata("design:paramtypes", [gdrive_service_1.GDriveService,
        users_service_1.UserService])
], ProcessRoute);
exports.ProcessRoute = ProcessRoute;
