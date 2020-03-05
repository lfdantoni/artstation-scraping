import {Schema, Document, model} from 'mongoose';

export interface IUser extends Document {
  gId: string,
  name: string,
  email: string
}

interface ICreateUser {
  email: IUser['email'];
  firstName: IUser['name'];
  lastName: IUser['email'];
}

const userSchema = new Schema({
  gId: String,
  name: String,
  email: String
},
{timestamps: true});

const userModel = model<IUser>('user', userSchema);

export default userModel;