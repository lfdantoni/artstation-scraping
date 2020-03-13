"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const controllers_1 = require("./constants/controllers");
const authorize_route_1 = require("../routes/authorize.route");
const types_1 = require("./constants/types");
const gdrive_service_1 = require("../services/gdrive.service");
const goauth_service_1 = require("../services/goauth.service");
const process_route_1 = require("../routes/process.route");
const users_service_1 = require("../services/users.service");
const credential_service_1 = require("../services/credential.service");
const appContainer = new inversify_1.Container();
exports.appContainer = appContainer;
// Services
appContainer.bind(types_1.TYPES.OAuth).to(goauth_service_1.GOAuthService).inSingletonScope();
appContainer.bind(types_1.TYPES.FileStorage).to(gdrive_service_1.GDriveService);
appContainer.bind(types_1.TYPES.UserService).to(users_service_1.UserService);
appContainer.bind(types_1.TYPES.CredentialService).to(credential_service_1.CredentialService);
// Routes
appContainer.bind(types_1.TYPES.Controller).to(authorize_route_1.AuthorizeRoute).whenTargetNamed(controllers_1.CONTROLLER_TAGS.Authorize);
appContainer.bind(types_1.TYPES.Controller).to(process_route_1.ProcessRoute).whenTargetNamed(controllers_1.CONTROLLER_TAGS.Process);
