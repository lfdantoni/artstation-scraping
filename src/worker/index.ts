import QueueClass from 'bull';
import throng from 'throng';
import {appContainer} from '../ioc/container';
import { ScrapingProcessOptions, ImageState, ArtStationScrapingService } from '../services/artstation-scraping.service';
import { UserService } from '../services/users.service';
import { TYPES } from '../ioc/constants/types';
import { GDriveService } from '../services/gdrive.service';
import { MongooseDB } from '../models/db';

// tslint:disable-next-line: no-var-requires
require('dotenv').config();

// Connect to a local redis intance locally, and the Heroku-provided URL in production
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Spin up multiple processes to handle jobs to take advantage of more CPU cores
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
const workers = process.env.WEB_CONCURRENCY || 2;

// The maxium number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
const maxJobsPerWorker = 50;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function start() {
  // Connect to the named work queue
  const workQueue = new QueueClass('worker', REDIS_URL);

  // tslint:disable-next-line: no-console
  console.log('Worker connected')

  workQueue.process(maxJobsPerWorker, async (job) => {
    // tslint:disable-next-line: no-console
    console.log(job)

    MongooseDB.connect()
    .then(async() => {
      const userService = appContainer.get<UserService>(TYPES.UserService);
      const fileStorage = appContainer.get<GDriveService>(TYPES.FileStorage);
      // tslint:disable-next-line: no-console
      console.log(job.id)


      const {artistId, userId, createRootFolder} = job.data;
      let rootFolderId = '';

      if (!artistId || !userId) {
        throw new Error('Invalid user or artist');
      }

      const userData = await userService.getUserWithCredential(userId);

      if (!userData) {
        throw new Error('Invalid user');
      }


      // TODO save the folderId to db
      if (createRootFolder && createRootFolder.toString() === 'true') {
        rootFolderId = await fileStorage.createFolder('ArtStationScrapingApp', userData.credential);
      } else {
        // TODO remove this
        rootFolderId = '1CWFoXbhTjGKxOaBofIdii7P5v-lbbKqZ';
      }

      const artistFolderId = await fileStorage.createFolder(artistId, userData.credential, rootFolderId);

      const serviceOptions: ScrapingProcessOptions = {
        artistId,
        updateCallback: async (state: ImageState) => {
          if (state.finish) {
            // tslint:disable-next-line: no-console
            console.log('downloadGallery: ', state.log);
            return;
          }

          await fileStorage.uploadFile(artistFolderId, state.imagePath, state.imageName, userData.credential);

          // tslint:disable-next-line: no-console
          console.log('downloadGallery: ', state);
        }
      }

      await (new ArtStationScrapingService(serviceOptions)).process();

      return { value: 'process '+ artistId };

      // // This is an example job that just slowly reports on progress
      // // while doing no work. Replace this with your own job logic.
      // let progress = 0;

      // // throw an error 5% of the time
      // if (Math.random() < 0.05) {
      //   throw new Error('This job failed!')
      // }

      // while (progress < 100) {
      //   await sleep(50);
      //   progress += 1;
      //   job.progress(progress)
      // }

      // // A job can return values that will be stored in Redis as JSON
      // // This return value is unused in this demo application.
      // return { value: 'This will be stored' };
    });
  });
}

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
throng({ workers, start });