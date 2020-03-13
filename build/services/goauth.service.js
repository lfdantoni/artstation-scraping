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
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const googleapis_1 = require("googleapis");
const inversify_1 = require("inversify");
const jsonwebtoken_1 = require("jsonwebtoken");
dotenv_1.config();
let GOAuthService = class GOAuthService {
    constructor() {
        this.SCOPES = [
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ];
        const { client_secret, client_id } = this.getCredentials();
        this.oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret);
    }
    setCredentials(tokens) {
        this.credentials = tokens;
        this.oAuth2Client.setCredentials({
            access_token: tokens.access_token,
            expiry_date: tokens.expiry_date,
            id_token: tokens.id_token,
            refresh_token: tokens.refresh_token,
            token_type: tokens.token_type
        });
    }
    getAuthUrl(redirectUri) {
        if (!this.oAuth2Client)
            throw Error('The service has not been setting up, call to setUp method.');
        return this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.SCOPES,
            redirect_uri: redirectUri
        });
    }
    async getToken(code, redirectUri) {
        if (!this.oAuth2Client)
            throw Error('The service has not been setting up, call to setUp method.');
        const resp = (await this.oAuth2Client.getToken({
            code,
            redirect_uri: redirectUri
        }));
        return Promise.resolve(resp.tokens);
    }
    getUserInfo() {
        if (this.credentials && this.credentials.id_token) {
            return jsonwebtoken_1.decode(this.credentials.id_token);
        }
        return null;
    }
    getCredentials() {
        return {
            client_id: process.env.GD_CLIENT_ID,
            client_secret: process.env.GD_CLIENT_SECRET
        };
    }
};
GOAuthService = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], GOAuthService);
exports.GOAuthService = GOAuthService;
