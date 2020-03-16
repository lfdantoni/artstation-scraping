import {Request, Response, Router} from 'express';
import {injectable} from 'inversify';
import {IRoute} from './route';
import QueueClass, {Queue} from 'bull';

@injectable()
export class ProcessRoute implements IRoute {
  router: Router;
  path: string = '/process';
  redis = process.env.REDIS_URL;
  queue: Queue;

  constructor() {
    this.router = Router();
    this.config();

    this.queue = new QueueClass('worker', this.redis);
  }

  private async enqueueProcess(req: Request, resp: Response) {
    const job = await this.queue.add({
      artistId: req.body.artistId,
      userId: req.body.userId,
      createRootFolder: req.body.createRootFolder
    });

    resp.json({ id: job.id });
  }

  private config(): void {
    this.router.post('/', this.enqueueProcess.bind(this));
  }
}
