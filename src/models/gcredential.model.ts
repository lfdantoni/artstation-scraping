import {Schema, Document, model, Model, Types} from 'mongoose';
import { IGCredential } from '../interfaces/entities/igcredential.entity';

export interface IGCredentialDocument extends IGCredential, Document {
}

export interface IGCredentialModel extends Model<IGCredentialDocument> {
  createOrUpdateCredential(credential: IGCredential): Promise<IGCredential>;
}

const gCredentialSchema = new Schema({
  access_token: String,
  refresh_token: String,
  id_token: String,
  expiry_date: Number,
  token_type: String
},
{timestamps: true});

gCredentialSchema.statics.createOrUpdateCredential = async function(credential: IGCredential): Promise<IGCredential> {
  if (credential.id) {
    await GCredentialModel.updateOne({_id: Types.ObjectId(credential.id)}, credential);
    return Promise.resolve(credential);
  } else {
    return new GCredentialModel(credential).save();
  }
}

export const GCredentialModel: IGCredentialModel = model<IGCredentialDocument, IGCredentialModel>('credential', gCredentialSchema);
