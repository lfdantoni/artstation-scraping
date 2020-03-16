import {Request, Response, Router} from 'express';
import {inject, injectable} from 'inversify';
import {TYPES} from '../ioc/constants/types';
import {ArtStationScrapingService, ImageState, ScrapingProcessOptions} from '../services/artstation-scraping.service';
import {GDriveService} from '../services/gdrive.service';
import {UserService} from '../services/users.service';
import {IRoute} from './route';
import QueueClass, {Queue} from 'bull';

@injectable()
export class ProcessRoute implements IRoute {
  router: Router;
  path: string = '/process';
  redis = process.env.REDIS_URL;
  queue: Queue;

  constructor(@inject(TYPES.FileStorage) private fileStorage: GDriveService,
              @inject(TYPES.UserService) private userService: UserService) {
    this.router = Router();
    this.config();

    this.queue = new QueueClass('worker', this.redis);
  }

  private async enqueueProcess(req: Request, resp: Response) {
    const {artistId, userId, createRootFolder} = req.body;
    let rootFolderId = '';

    if (!artistId || !userId) {
      resp.status(400);
      resp.json({
        description: 'Invalid user or artist'
      });
      return;
    }

    const userData = await this.userService.getUserWithCredential(userId);

    if (!userData) {
      resp.status(400);
      resp.json({
        description: 'Invalid user'
      });
      return;
    }


    // TODO save the folderId to db
    if (createRootFolder) {
      rootFolderId = await this.fileStorage.createFolder('ArtStationScrapingApp', userData.credential);
    } else {
      // TODO remove this
      rootFolderId = '1CWFoXbhTjGKxOaBofIdii7P5v-lbbKqZ';
    }

    const artistFolderId = await this.fileStorage.createFolder(artistId, userData.credential, rootFolderId);

    const serviceOptions: ScrapingProcessOptions = {
      artistId,
      updateCallback: async (state: ImageState) => {
        if (state.finish) {
          // tslint:disable-next-line: no-console
          console.log('downloadGallery: ', state.log);
          return;
        }

        await this.fileStorage.uploadFile(artistFolderId, state.imagePath, state.imageName, userData.credential);

        // tslint:disable-next-line: no-console
        console.log('downloadGallery: ', state);
      }
    }

    await (new ArtStationScrapingService(serviceOptions)).process();

    resp.json({
      resp: 'process '+req.body.artistId
    })
  }

  private async testQueue(req: Request, resp: Response) {

    const job = await this.queue.add({
      artistId: req.query.artistId,
      userId: req.query.userId,
      createRootFolder: req.query.createRootFolder
    });

    // tslint:disable-next-line: no-console
    console.log(job)
    resp.json({ id: job.id });
  }

  private config(): void {
    this.router.post('/', this.enqueueProcess.bind(this));
    this.router.get('/', this.testQueue.bind(this))
  }
}
