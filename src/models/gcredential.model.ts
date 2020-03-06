import {Schema, Document, model, Model} from 'mongoose';
import { IGCredential } from '../interfaces/entities/igcredential.entity';

export interface IGCredentialModel extends IGCredential, Document {
}

const gCredentialSchema = new Schema({
  access_token: String,
  refresh_token: String,
  id_token: String,
},
{timestamps: true});

export const GCredentialModel: Model<IGCredentialModel> = model<IGCredentialModel>('credential', gCredentialSchema);
