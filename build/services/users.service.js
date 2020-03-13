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
const user_model_1 = require("../models/user.model");
const inversify_1 = require("inversify");
const gcredential_model_1 = require("../models/gcredential.model");
const types_1 = require("../ioc/constants/types");
const credential_service_1 = require("./credential.service");
let UserService = class UserService {
    constructor(credentialService) {
        this.credentialService = credentialService;
    }
    async createUser(user) {
        // Checking some internal property to be sure that credentials is an entity and not its id due to Mongoose schema
        if (user.credential && user.credential.access_token) {
            user.credential = (await new gcredential_model_1.GCredentialModel(user.credential).save())._id;
        }
        const userSaved = await new user_model_1.UserModel(user).save();
        return Promise.resolve(userSaved);
    }
    async getUserByGId(gId) {
        return user_model_1.UserModel.findOne({ gId });
    }
    async getUserByGIdWithCredential(gId) {
        return user_model_1.UserModel.findByGidWithGCredentials(gId);
    }
    async getUserWithCredential(userId) {
        return user_model_1.UserModel.findWithGCredentials(userId);
    }
    async createOrUpdateUser(user) {
        let possibleCurrentUser = null;
        if (!user.id && user.gId) {
            possibleCurrentUser = await this.getUserByGIdWithCredential(user.gId);
            if (possibleCurrentUser) {
                user.id = possibleCurrentUser.id.toString();
                if (user.credential) {
                    user.credential.id = possibleCurrentUser.credentialId.toString();
                }
            }
        }
        if (user.credential) {
            user.credentialId = (await this.credentialService.createOrUpdateCredential(user.credential)).id.toString();
        }
        return user_model_1.UserModel.createOrUpdateUser(user);
    }
};
UserService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.CredentialService)),
    __metadata("design:paramtypes", [credential_service_1.CredentialService])
], UserService);
exports.UserService = UserService;
