import { injectable } from 'inversify';
import { IGCredential } from '../interfaces/entities/igcredential.entity';
import { GCredentialModel } from '../models/gcredential.model';

@injectable()
export class CredentialService {
  async createOrUpdateCredential(credential: IGCredential): Promise<IGCredential> {
    return GCredentialModel.createOrUpdateCredential(credential);
  }
}