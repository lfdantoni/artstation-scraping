import {Schema, Document, model, Model} from 'mongoose';
import { IUser } from '../interfaces/entities/user.entity';
import { IGCredentialModel } from './gcredential.model';

const userSchema = new Schema({
  gId: String,
  name: String,
  email: String,
  credential: {
    type: Schema.Types.ObjectId,
    ref: 'credential'
  },
},
{timestamps: true});

export interface IUserDocument extends IUser, Document {
}

export interface IUserModel extends Model<IUserDocument> {
  findWithGCredentials(id: string): Promise<IUserPopulated>;
}

export interface IUserPopulated extends IUser {
  credential: IGCredentialModel;
}

// Static methods
userSchema.statics.findWithGCredentials = async function(id: string): Promise<IUserPopulated> {
  return this.findById(id).populate('credential').exec()
}

userSchema.virtual('credentialId').get(function() {
  return this.credential ? this.credential._id : null;
})

export const UserModel:IUserModel = model<IUserDocument, IUserModel>('user', userSchema);
