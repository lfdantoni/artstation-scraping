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
const fs_1 = require("fs");
const googleapis_1 = require("googleapis");
const inversify_1 = require("inversify");
const types_1 = require("../ioc/constants/types");
const goauth_service_1 = require("./goauth.service");
const mime_type_helper_1 = require("../helpers/mime-type.helper");
let GDriveService = class GDriveService {
    constructor(oAuthService) {
        this.oAuthService = oAuthService;
    }
    async listFiles(folderId, credential) {
        this.checkCredential(credential);
        const drive = googleapis_1.google.drive({ version: 'v3', auth: this.oAuthService.oAuth2Client });
        return new Promise((resolve, reject) => {
            drive.files.list({
                q: `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false`,
                pageSize: 10,
                fields: 'nextPageToken, files(id, name)',
            }, (err, res) => {
                if (err) {
                    console.log('The API returned an error: ' + err);
                    reject('The API returned an error: ' + err);
                    return;
                }
                const files = res.data.files;
                if (files.length) {
                    resolve(files);
                }
                else {
                    resolve([]);
                    console.log('No file was found.');
                }
            });
        });
    }
    async uploadFile(folderId, filePath, imageName, credential) {
        this.checkCredential(credential);
        const drive = new googleapis_1.drive_v3.Drive({ auth: this.oAuthService.oAuth2Client });
        const mimeType = mime_type_helper_1.MimeTypeHelper.getContentType(mime_type_helper_1.MimeTypeHelper.getExt(filePath));
        const res = await drive.files.create({
            requestBody: {
                parents: [folderId],
                name: imageName,
                mimeType
            },
            media: {
                mimeType,
                body: fs_1.createReadStream(filePath)
            }
        });
        console.log('uploadFile ', res.data);
    }
    async createFolder(name, credential, parentFolderId) {
        this.checkCredential(credential);
        const drive = new googleapis_1.drive_v3.Drive({ auth: this.oAuthService.oAuth2Client });
        const fileMetadata = {
            'name': name,
            'mimeType': 'application/vnd.google-apps.folder'
        };
        if (parentFolderId) {
            fileMetadata.parents = [parentFolderId];
        }
        return new Promise(async (resolve, reject) => {
            try {
                const resp = await drive.files.create({
                    requestBody: fileMetadata,
                    fields: 'id'
                });
                resolve(resp.data.id);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    checkCredential(credential) {
        if (credential) {
            this.oAuthService.setCredentials(credential);
        }
    }
};
GDriveService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.OAuth)),
    __metadata("design:paramtypes", [goauth_service_1.GOAuthService])
], GDriveService);
exports.GDriveService = GDriveService;
