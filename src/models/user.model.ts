import {Schema, Document, model, Model, Types} from 'mongoose';
import { IUser } from '../interfaces/entities/user.entity';

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
  findByGidWithGCredentials(gId: string): Promise<IUserDocument>;
  findWithGCredentials(id: string): Promise<IUserDocument>;
  createOrUpdateUser(user: IUser): Promise<IUser>;
}

// Static methods
// don't use arrow functions in order to preserve the mongoose context
userSchema.statics.findByGidWithGCredentials = async function(gId: string): Promise<IUserDocument> {
  return this.findOne({gId}).populate('credential').exec();
}

userSchema.statics.findWithGCredentials = async function(id: string): Promise<IUserDocument> {
  return this.findById(id).populate('credential').exec();
}

userSchema.statics.createOrUpdateUser = async function(user: IUser): Promise<IUser> {
  if(user.id) {
    await this.updateOne({_id: Types.ObjectId(user.id)},
    {
      ...user,
      credential: Types.ObjectId(user.credentialId)
    })
    return Promise.resolve(user)
  } else {
    return new UserModel({
      ...user,
      credential: Types.ObjectId(user.credentialId)
    }).save()
  }
}

userSchema.virtual('credentialId').get(function() {
  return this.credential ? this.credential._id : null;
})

export const UserModel:IUserModel = model<IUserDocument, IUserModel>('user', userSchema);
