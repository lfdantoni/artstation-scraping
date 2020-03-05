// tslint:disable: no-console
import { IRoute } from './route';
import { Router, Request, Response } from 'express';
import { GDriveService } from '../services/gdrive.service';
import { FileManagerHelper } from '../helpers/file-manager.helper';
import { GOAuthService } from '../services/goauth.service';
import { injectable, inject } from 'inversify';
import { TYPES } from '../ioc/constants/types';
import UserModel from '../models/user.model';

@injectable()
export class AuthorizeRoute implements IRoute {
  router: Router;
  path: string = '/authorize';

  // TODO replace it for DB
  private tokenPath = 'tokens.json'

  constructor(
    @inject(TYPES.OAuth) private oauthService: GOAuthService,
    @inject(TYPES.FileStorage) private gDriveService: GDriveService ) {
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

      this.oauthService.setCredentials(token);

      // TODO add logic to save folder id by user
      const folderId = '1CWFoXbhTjGKxOaBofIdii7P5v-lbbKqZ';
      await this.gDriveService.uploadFile(folderId);
      const userInfo = this.oauthService.getUserInfo() || { };

      const userSaved = await UserModel.findOne({gId: userInfo.sub});

      if (!userSaved) {
        await UserModel
          .create({
            name: userInfo.name,
            email: userInfo.email,
            gId: userInfo.sub
          });
      } else {
        await userSaved.updateOne({
          email: userInfo.email+ (new Date()).getTime()
        })
      }

      resp.json({
        userName: userInfo.name,
        userEmail: userInfo.email,
        userPicture: userInfo.picture,
        userId: userInfo.sub,
        files: await this.gDriveService.listFiles(folderId)
      })
    } else {
      console.log(this.oauthService.getAuthUrl(fullReqUrl))
      resp.redirect(this.oauthService.getAuthUrl(fullReqUrl));
    }
  }

  private config(): void {
    this.router.get('/', this.validateCode);
  }
}
