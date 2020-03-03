import 'reflect-metadata';
import {Container} from 'inversify';
import {CONTROLLER_TAGS} from './constants/controllers';
import {IRoute} from '../routes/route';
import {AuthorizeRoute} from '../routes/authorize.route';
import { TYPES } from './constants/types';
import { GDriveService } from '../services/gdrive.service';
import { GOAuthService } from '../services/goauth.service';

export interface Weapon {
  hit(): string;
}

const appContainer = new Container();
appContainer.bind<GOAuthService>(TYPES.OAuth).to(GOAuthService).inSingletonScope();
appContainer.bind<GDriveService>(TYPES.FileStorage).to(GDriveService);
appContainer.bind<IRoute>(TYPES.Controller).to(AuthorizeRoute).whenTargetNamed(CONTROLLER_TAGS.Authorize);

export {appContainer};
