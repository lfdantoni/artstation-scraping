import {UserModel} from '../models/user.model';
import { IUser } from '../interfaces/entities/user.entity';
import { IGCredential } from '../interfaces/entities/igcredential.entity';
import { injectable } from 'inversify';
import { GCredentialModel } from '../models/gcredential.model';

@injectable()
export class UserService {
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

  async getUserWithCredential(userId: string): Promise<IUser> {
    return UserModel.findWithGCredentials(userId);
  }
}