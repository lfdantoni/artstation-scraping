<!-- omit in toc -->
# ArtStation Scraping

Table Contents

- [About](#about)
- [Architecture](#architecture)
  - [Environment variables](#environment-variables)
  - [Endpoints](#endpoints)
    - [/authorize](#authorize)
    - [POST /process](#post-process)
- [Resources](#resources)
  - [Libraries/Technologies](#librariestechnologies)
  - [Code](#code)
  - [Visual Studio Code IDE](#visual-studio-code-ide)


## About

The goal of the present project is use different technologies in order to download images from some website, finally those images will be uploaded to Google Drive

## Architecture

### Environment variables

You can set the environment variables on your system or you can create a .env file in the root project folder and set those on it.

```
ENVIRONMENT=local

# Google App Credentials
GD_CLIENT_ID=client_id
GD_CLIENT_SECRET=client_secret

# Mongo
MONGODB_URI=mongodb_connection_string

# Basic Auth
ADM_USER=user
ADM_PASS=password

# Redis
REDIS_URL=redis_connection_string
```

### Endpoints

#### /authorize

It will use the google app credentials in order to get the user Drive's permission to upload the images.

#### POST /process

**Need Basic Auth**

It will enqueue a new process to download the artist's images

Body:

```json
{
	"artistId": "artist name path",
	"userId": "user_db_id",
	"createRootFolder": false
}
```

`createRootFolder` -> true: create the root folder in the user's Drive in order to upload the images.

## Resources

### Libraries/Technologies
- [Node](https://nodejs.org/en/docs/)
- [Puppeteer](https://github.com/puppeteer/puppeteer)
- [Redis](https://redis.io/) with [bull](https://github.com/OptimalBits/bull)
- [Typescript](https://www.typescriptlang.org/)
- [googleapis](https://github.com/googleapis/google-api-nodejs-client)
- [MongoDB](https://www.mongodb.com/) with [mongoose](https://mongoosejs.com/)
- [inversify (IoC)](https://github.com/inversify/InversifyJS)
- [express](https://expressjs.com/)
- [dotenv](https://github.com/motdotla/dotenv)
- [express-basic-auth](https://github.com/LionC/express-basic-auth)
- [nodemon](https://nodemon.io/)
- [google drive api](https://developers.google.com/drive/api/v3)

### Code

https://medium.com/create-a-server-with-nodemon-express-typescript/create-a-server-with-nodemon-express-typescript-f7c88fb5ee71

### Visual Studio Code IDE

https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one