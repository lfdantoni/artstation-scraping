import express from 'express';
import {join} from 'path';
import {Config} from './config';
import {appContainer} from './ioc/container';
import {TYPES} from './ioc/constants/types';
import { IRoute } from './routes/route';
import { CONTROLLER_TAGS } from './ioc/constants/controllers';
import { MongooseDB } from './models/db';

// tslint:disable-next-line: no-var-requires
require('dotenv').config();

MongooseDB.connect()
.then(() => {
  const app = express()
  const port = process.env.PORT || 5000
  app.use('/downloads', express.static(join(__dirname, Config.localFolderDownload)));
  app.use('/assets', express.static(join(__dirname, Config.assetsFolder)));

  app.use(express.json());

  const authRouter = appContainer.getNamed<IRoute>(TYPES.Controller, CONTROLLER_TAGS.Authorize);
  const processRouter = appContainer.getNamed<IRoute>(TYPES.Controller, CONTROLLER_TAGS.Process);

  app.use(authRouter.path, authRouter.router);
  app.use(processRouter.path, processRouter.router);

  // tslint:disable-next-line: no-console
  app.listen(port, () => console.log(`Example app listening on port ${port}! -> http://localhost:${port}`));
});
