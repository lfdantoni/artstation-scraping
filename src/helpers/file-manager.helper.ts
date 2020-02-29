import {writeFileSync} from 'fs';

export class FileManagerHelper {
  static saveJsonFile(path: string, data: any) {
    writeFileSync(path, JSON.stringify(data));
  }
}