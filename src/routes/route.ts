import { Router } from 'express';

export interface IRoute {
  router: Router;
  path: string;
}