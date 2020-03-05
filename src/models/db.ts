import {connect, Mongoose} from 'mongoose'
import {config} from 'dotenv'

config()

export class MongooseDB {
  static async connect(): Promise<Mongoose> {
    return connect(process.env.DB_CS, {useNewUrlParser: true})
      .catch(error => {
        // tslint:disable-next-line: no-console
        console.error('Error connecting to database: ', error);
        return process.exit(1);
      });
  }
}