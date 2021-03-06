import {config} from 'dotenv';
import {google} from 'googleapis';
import {injectable} from 'inversify';
import {decode} from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

config();

@injectable()
export class GOAuthService {
  private SCOPES = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'];

  public oAuth2Client: any;

  private credentials: any;

  constructor() {
    const {client_secret, client_id} = this.getCredentials();

    this.oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret);
  }

  public setCredentials(tokens: any) {
    this.credentials = tokens;
    this.oAuth2Client.setCredentials({
      access_token: tokens.access_token,
      expiry_date: tokens.expiry_date,
      id_token: tokens.id_token,
      refresh_token: tokens.refresh_token,
      token_type: tokens.token_type
    });
  }

  public getAuthUrl(redirectUri?: string) {
    if(!this.oAuth2Client) throw Error('The service has not been setting up, call to setUp method.');

    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES,
      redirect_uri: redirectUri
    });
  }

  public async getToken(code: string, redirectUri: string): Promise<any> {
    if(!this.oAuth2Client) throw Error('The service has not been setting up, call to setUp method.');
    const resp = (await this.oAuth2Client.getToken({
      code,
      redirect_uri: redirectUri
    }));

    return Promise.resolve(resp.tokens);
  }

  public getUserInfo(): any {
    if(this.credentials && this.credentials.id_token) {
      return decode(this.credentials.id_token)
    }

    return null;
  }

  private getCredentials():  {client_secret: string, client_id: string} {
    return {
      client_id: process.env.GD_CLIENT_ID,
      client_secret: process.env.GD_CLIENT_SECRET
    }
  }
}