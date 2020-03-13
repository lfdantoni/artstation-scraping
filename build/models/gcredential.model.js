"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const gCredentialSchema = new mongoose_1.Schema({
    access_token: String,
    refresh_token: String,
    id_token: String,
    expiry_date: Number,
    token_type: String
}, { timestamps: true });
gCredentialSchema.statics.createOrUpdateCredential = async function (credential) {
    if (credential.id) {
        await exports.GCredentialModel.updateOne({ _id: mongoose_1.Types.ObjectId(credential.id) }, credential);
        return Promise.resolve(credential);
    }
    else {
        return new exports.GCredentialModel(credential).save();
    }
};
exports.GCredentialModel = mongoose_1.model('credential', gCredentialSchema);
