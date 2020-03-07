import {UserModel} from '../models/user.model';
import { IUser } from '../interfaces/entities/user.entity';
import { injectable, inject } from 'inversify';
import { GCredentialModel } from '../models/gcredential.model';
import { TYPES } from '../ioc/constants/types';
import { CredentialService } from './credential.service';

@injectable()
export class UserService {
  constructor(@inject(TYPES.CredentialService) private credentialService: CredentialService) { }

  async createUser(user: IUser): Promise<IUser> {
    // Checking some internal property to be sure that credentials is an entity and not its id due to Mongoose schema
    if (user.credential && user.credential.access_token) {
      user.credential = (await new GCredentialModel(user.credential).save())._id;
    }

    const userSaved = await new UserModel(user).save();

    return Promise.resolve(userSaved)
  }

  async getUserByGId(gId: string): Promise<IUser> {
    return UserModel.findOne({ gId });
  }

  async getUserByGIdWithCredential(gId: string): Promise<IUser> {
    return UserModel.findByGidWithGCredentials(gId);
  }

  async getUserWithCredential(userId: string): Promise<IUser> {
    return UserModel.findWithGCredentials(userId);
  }

  async createOrUpdateUser(user: IUser) {
    let possibleCurrentUser: IUser = null;

    if(!user.id && user.gId) {
      possibleCurrentUser = await this.getUserByGIdWithCredential(user.gId);

      if (possibleCurrentUser) {
        user.id = possibleCurrentUser.id.toString();

        if (user.credential) {
          user.credential.id = possibleCurrentUser.credentialId.toString();
        }
      }
    }

    if (user.credential) {
      user.credentialId = (await this.credentialService.createOrUpdateCredential(user.credential)).id.toString();
    }

    return UserModel.createOrUpdateUser(user);
  }
}