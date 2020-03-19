import { IGCredential } from './igcredential.entity';

export interface IUser {
  id?: any;
  email: string;
  name: string;
  gId: string;
  credential?: IGCredential;
  credentialId?: string;
}