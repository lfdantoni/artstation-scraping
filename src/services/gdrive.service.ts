// tslint:disable: no-console
import {createReadStream} from 'fs';
import {drive_v3, google} from 'googleapis';
import { inject, injectable } from 'inversify';
import { TYPES } from '../ioc/constants/types';
import { GOAuthService } from './goauth.service';

@injectable()
export class GDriveService {

  constructor(@inject(TYPES.OAuth) private oAuthService: GOAuthService) { }

  public listFiles(folderId: string): Promise<any[]> {
    const drive = google.drive({version: 'v3', auth:  this.oAuthService.oAuth2Client});

    return new Promise((resolve, reject) => {

      drive.files.list({
        q: `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false`,
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
      }, (err: any, res: any) => {
        if (err) {
          console.log('The API returned an error: ' + err);
          reject('The API returned an error: ' + err);
          return;
        }

        const files = res.data.files;
        if (files.length) {
          resolve(files);
        } else {
          resolve([]);
          console.log('No file was found.');
        }
      });
    })
  }

  public async uploadFile(folderId: string) {
    const drive = new drive_v3.Drive({auth: this.oAuthService.oAuth2Client})

    const res = await drive.files.create({
      requestBody: {
        parents: [folderId], // youtube folder
        name: 'image_upload_test.jpg',
        mimeType: 'image/jpg'
      },
      media: {
        mimeType: 'image/jpg',
        body: createReadStream('image_upload.jpg')
      }
    });

    console.log('uploadFile ', res.data);
  }

  public async createFolder(name: string): Promise<string> {
    const drive = new drive_v3.Drive({auth: this.oAuthService.oAuth2Client});

    const fileMetadata = {
      'name': name,
      'mimeType': 'application/vnd.google-apps.folder'
    };

    return new Promise(async(resolve, reject) => {
      try {
        const resp = await drive.files.create({
          requestBody: fileMetadata,
          fields: 'id'
        });

        resolve(resp.data.id);

      } catch (error) {
        reject(error);
      }
    })
  }
}
