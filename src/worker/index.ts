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
const imagesPerJob = 7;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function start() {
  // Connect to the named work queue

  // TODO: Create different QUEUE!!!!
  const workQueue = new QueueClass('worker', REDIS_URL);

  // tslint:disable-next-line: no-console
  console.log('Worker connected')

  workQueue.process(maxJobsPerWorker, async (job) => {
    if(job.data.urls) {
      // tslint:disable-next-line: no-console
      console.log(job.data)
      const urls: string[] = job.data.urls;
      const urlsToProcess = urls.slice(0, imagesPerJob);
      let artistFolderId: string = job.data.artistFolderId;

      await MongooseDB.connect()
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

        artistFolderId = artistFolderId ? artistFolderId : await fileStorage.createFolder(artistId, userData.credential, rootFolderId);

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

        await (new ArtStationScrapingService(serviceOptions)).getImagesFromPages(urlsToProcess);

        return Promise.resolve();
      });

      const nextUrls: string[] = job.data.urls.slice(imagesPerJob, job.data.urls.length);

      if(nextUrls.length > 0) {
        const nextJob = await workQueue.add({
          artistId: job.data.artistId,
          userId: job.data.userId,
          createRootFolder:  job.data.createRootFolder,
          artistFolderId,
          urls: nextUrls
        });

        return Promise.resolve({ value: 'nextJob '+ nextJob.id });

      } else {

        return Promise.resolve({ value: 'download finished '+ job.data.artistId });
      }


    } else {

      const {artistId} = job.data;

      const serviceOptions: ScrapingProcessOptions = {
        artistId,
        updateCallback: async (state: ImageState) => {
          // tslint:disable-next-line: no-console
          console.log('downloadGallery: ', state);
        }
      }

      const urls = await (new ArtStationScrapingService(serviceOptions)).getImageUrls();

      const nextJob = await workQueue.add({
        artistId: job.data.artistId,
        userId: job.data.userId,
        createRootFolder:  job.data.createRootFolder,
        urls
      });

      return  Promise.resolve({ value: 'nextJob from workQueue '+ nextJob.id });
    }

  })

  // workQueue.process(maxJobsPerWorker, async (job) => {
  //   // tslint:disable-next-line: no-console
  //   console.log(job.data)

  //   MongooseDB.connect()
  //   .then(async() => {
  //     const userService = appContainer.get<UserService>(TYPES.UserService);
  //     const fileStorage = appContainer.get<GDriveService>(TYPES.FileStorage);
  //     // tslint:disable-next-line: no-console
  //     console.log(job.id)


  //     const {artistId, userId, createRootFolder} = job.data;
  //     let rootFolderId = '';

  //     if (!artistId || !userId) {
  //       throw new Error('Invalid user or artist');
  //     }

  //     const userData = await userService.getUserWithCredential(userId);

  //     if (!userData) {
  //       throw new Error('Invalid user');
  //     }


  //     // TODO save the folderId to db
  //     if (createRootFolder && createRootFolder.toString() === 'true') {
  //       rootFolderId = await fileStorage.createFolder('ArtStationScrapingApp', userData.credential);
  //     } else {
  //       // TODO remove this
  //       rootFolderId = '1CWFoXbhTjGKxOaBofIdii7P5v-lbbKqZ';
  //     }

  //     const artistFolderId = await fileStorage.createFolder(artistId, userData.credential, rootFolderId);

  //     const serviceOptions: ScrapingProcessOptions = {
  //       artistId,
  //       updateCallback: async (state: ImageState) => {
  //         if (state.finish) {
  //           // tslint:disable-next-line: no-console
  //           console.log('downloadGallery: ', state.log);
  //           return;
  //         }

  //         await fileStorage.uploadFile(artistFolderId, state.imagePath, state.imageName, userData.credential);

  //         // tslint:disable-next-line: no-console
  //         console.log('downloadGallery: ', state);
  //       }
  //     }

  //     await (new ArtStationScrapingService(serviceOptions)).process();

  //     return { value: 'process '+ artistId };

  //   });
  // });
}

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
start();
// throng({ workers, start });