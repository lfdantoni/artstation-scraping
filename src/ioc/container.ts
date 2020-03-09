import 'reflect-metadata';
import {Container} from 'inversify';
import {CONTROLLER_TAGS} from './constants/controllers';
import {IRoute} from '../routes/route';
import {AuthorizeRoute} from '../routes/authorize.route';
import { TYPES } from './constants/types';
import { GDriveService } from '../services/gdrive.service';
import { GOAuthService } from '../services/goauth.service';
import { ProcessRoute } from '../routes/process.route';
import { UserService } from '../services/users.service';
import { CredentialService } from '../services/credential.service';

const appContainer = new Container();

// Services
appContainer.bind<GOAuthService>(TYPES.OAuth).to(GOAuthService).inSingletonScope();
appContainer.bind<GDriveService>(TYPES.FileStorage).to(GDriveService);
appContainer.bind<UserService>(TYPES.UserService).to(UserService);
appContainer.bind<CredentialService>(TYPES.CredentialService).to(CredentialService);

// Routes
appContainer.bind<IRoute>(TYPES.Controller).to(AuthorizeRoute).whenTargetNamed(CONTROLLER_TAGS.Authorize);
appContainer.bind<IRoute>(TYPES.Controller).to(ProcessRoute).whenTargetNamed(CONTROLLER_TAGS.Process);


export {appContainer};
