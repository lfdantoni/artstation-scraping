// tslint:disable: no-console
import {createReadStream} from 'fs';
import {drive_v3, google} from 'googleapis';
import { inject, injectable } from 'inversify';
import { TYPES } from '../ioc/constants/types';
import { GOAuthService } from './goauth.service';
import { MimeTypeHelper } from '../helpers/mime-type.helper';
import { IGCredential } from '@interfaces/entities/igcredential.entity';

@injectable()
export class GDriveService {

  constructor(@inject(TYPES.OAuth) private oAuthService: GOAuthService) { }

  public async listFiles(folderId: string, credential?: IGCredential): Promise<any[]> {
    this.checkCredential(credential);

    const drive = google.drive({
      version: 'v3',
      auth: this.oAuthService.oAuth2Client
    });

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

  public async uploadFile(folderId: string, filePath: string, imageName: string, credential?: IGCredential) {
    this.checkCredential(credential);

    const drive = new drive_v3.Drive({auth: this.oAuthService.oAuth2Client})
    const mimeType = MimeTypeHelper.getContentType(MimeTypeHelper.getExt(filePath));

    const res = await drive.files.create({
      requestBody: {
        parents: [folderId], // youtube folder
        name: imageName,
        mimeType
      },
      media: {
        mimeType,
        body: createReadStream(filePath)
      }
    });

    console.log('uploadFile ', res.data);
  }

  public async createFolder(name: string, credential?: IGCredential, parentFolderId?: string): Promise<string> {
    this.checkCredential(credential);

    const drive = new drive_v3.Drive({auth: this.oAuthService.oAuth2Client});

    const fileMetadata: drive_v3.Schema$File = {
      'name': name,
      'mimeType': 'application/vnd.google-apps.folder'
    };

    if (parentFolderId) {
      fileMetadata.parents = [parentFolderId];
    }

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

  private checkCredential(credential?: IGCredential) {
    if (credential) {
      this.oAuthService.setCredentials(credential);
    }
  }
}
