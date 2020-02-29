// tslint:disable: no-console
import { Route } from './route';
import { Router, Request, Response, response } from 'express';
import { GDriveService } from '../services/gdrive.service';
import { FileManagerHelper } from '../helpers/file-manager.helper';

class AuthorizeRoute implements Route {
  router: Router;
  path: string = '/authorize';

  private gDriveService: GDriveService;

  // TODO replace it for DB
  private tokenPath = 'tokens.json'

  constructor() {
    this.gDriveService = new GDriveService();
    this.router = Router();
    this.config();
  }

  private validateCode = async (req: Request, resp: Response) => {
    const fullReqUrl = req.protocol + '://' + req.get('host') + this.path;
    console.log(fullReqUrl);
    this.gDriveService.setUp(fullReqUrl);

    if(req.query.code) {
      const token = await this.gDriveService.getToken(req.query.code);
      FileManagerHelper.saveJsonFile(this.tokenPath, token);
      console.log(token)

      this.gDriveService.setCredentials(token);

      // TODO add logic to save folder id by user
      await this.gDriveService.uploadFile('1CWFoXbhTjGKxOaBofIdii7P5v-lbbKqZ');

      resp.json(await this.gDriveService.listFiles());
    } else {
      console.log(this.gDriveService.getAuthUrl())
      resp.redirect(this.gDriveService.getAuthUrl());
    }
  }

  private config(): void {
    this.router.get('/', this.validateCode);
  }
}

const authorizeRoute = new AuthorizeRoute();
export default authorizeRoute;