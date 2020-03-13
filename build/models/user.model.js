"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    gId: String,
    name: String,
    email: String,
    credential: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'credential'
    },
}, { timestamps: true });
// Static methods
// don't use arrow functions in order to preserve the mongoose context
userSchema.statics.findByGidWithGCredentials = async function (gId) {
    return this.findOne({ gId }).populate('credential').exec();
};
userSchema.statics.findWithGCredentials = async function (id) {
    return this.findById(id).populate('credential').exec();
};
userSchema.statics.createOrUpdateUser = async function (user) {
    if (user.id) {
        await this.updateOne({ _id: mongoose_1.Types.ObjectId(user.id) }, {
            ...user,
            credential: mongoose_1.Types.ObjectId(user.credentialId)
        });
        return Promise.resolve(user);
    }
    else {
        return new exports.UserModel({
            ...user,
            credential: mongoose_1.Types.ObjectId(user.credentialId)
        }).save();
    }
};
userSchema.virtual('credentialId').get(function () {
    return this.credential ? this.credential._id : null;
});
exports.UserModel = mongoose_1.model('user', userSchema);
