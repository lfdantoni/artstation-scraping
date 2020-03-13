"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dotenv_1 = require("dotenv");
dotenv_1.config();
class MongooseDB {
    static async connect() {
        return mongoose_1.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
            .catch(error => {
            // tslint:disable-next-line: no-console
            console.error('Error connecting to database: ', error);
            return process.exit(1);
        });
    }
}
exports.MongooseDB = MongooseDB;
