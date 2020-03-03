import { IRoute } from './route';
import { Router, Request, Response } from 'express';
import { ScrapingProcessOptions, ImageState, ArtStationScrapingService } from '../services/artstation-scraping.service';

class ProcessRoute implements IRoute {
  router: Router;
  path: string = '/process';

  constructor() {
    this.router = Router();
    this.config();
  }

  private async enqueueProcess(req: Request, resp: Response) {
    const serviceOptions: ScrapingProcessOptions = {
      artistId: req.body.artistId,
      updateCallback: (state: ImageState) => {
        if (state.finish) {
          // tslint:disable-next-line: no-console
          console.log('downloadGallery: ', state.log);
          return;
        }

        // tslint:disable-next-line: no-console
        console.log('downloadGallery: ', state.log);
      }
    }

    await (new ArtStationScrapingService(serviceOptions)).process();

    resp.json({
      resp: 'process '+req.body.artistId
    })
  }

  private config(): void {
    this.router.post('/', this.enqueueProcess);
  }
}

const processRoute = new ProcessRoute();
export default processRoute;