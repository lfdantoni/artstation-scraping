// tslint:disable: no-console
import {Request, Response, Router} from 'express';
import {inject, injectable} from 'inversify';
import {FileManagerHelper} from '../helpers/file-manager.helper';
import {TYPES} from '../ioc/constants/types';
import {GDriveService} from '../services/gdrive.service';
import {GOAuthService} from '../services/goauth.service';
import {UserService} from '../services/users.service';
import {IRoute} from './route';

@injectable()
export class AuthorizeRoute implements IRoute {
  router: Router;
  path: string = '/authorize';

  // TODO replace it for DB
  private tokenPath = 'tokens.json'

  constructor(
    @inject(TYPES.OAuth) private oauthService: GOAuthService,
    @inject(TYPES.FileStorage) private gDriveService: GDriveService,
    @inject(TYPES.UserService) private userService: UserService ) {
    this.router = Router();
    this.config();
  }

  private validateCode = async (req: Request, resp: Response) => {
    const protocol = process.env.ENVIRONMENT==='local' ? 'http' : 'https';
    const fullReqUrl = protocol + '://' + req.get('host') + this.path;
    console.log(fullReqUrl);

    console.log(req.query.code)

    if(req.query.code) {
      const token = await this.oauthService.getToken(req.query.code, fullReqUrl);
      FileManagerHelper.saveJsonFile(this.tokenPath, token);
      console.log(token)

      // TODO add logic to check if I've received the refresh_token

      this.oauthService.setCredentials(token);
      const userInfo = this.oauthService.getUserInfo() || { };

      const userSaved = await this.userService.createOrUpdateUser({
        name: userInfo.name,
        email: userInfo.email,
        gId: userInfo.sub,
        credential: token
      });

      resp.json(userSaved);
    } else {
      console.log(this.oauthService.getAuthUrl(fullReqUrl))
      resp.redirect(this.oauthService.getAuthUrl(fullReqUrl));
    }
  }

  private config(): void {
    this.router.get('/', this.validateCode);
  }
}
