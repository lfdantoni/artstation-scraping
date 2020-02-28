import { Route } from './route';
import { Router, Request, Response, response } from 'express';
import { GDriveService } from '../services/gdrive.service';

class AuthorizeRoute implements Route {
  router: Router;
  path: string = '/authorize';

  private gDriveService: GDriveService;


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
      console.log(token)
      
      await this.gDriveService.uploadFile(token);
      
      resp.json(await this.gDriveService.listFiles(token));
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