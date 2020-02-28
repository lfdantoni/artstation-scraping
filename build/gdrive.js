"use strict";
// const {OAuth2Client, auth} = require('google-auth-library');
// const http = require('http');
// const url = require('url');
// const openAux = require('open');
// const destroyer = require('server-destroy');
Object.defineProperty(exports, "__esModule", { value: true });
// // Download your OAuth2 configuration from the Google
// const keys = require('./artstation-scraping-2542387682cf.json');
// /**
//  * Start by acquiring a pre-authenticated oAuth2 client.
//  */
// async function main() {
//   // const oAuth2Client: any = await getAuthenticatedClient();
//   // // Make a simple request to the People API using our pre-authenticated client. The `request()` method
//   // // takes an GaxiosOptions object.  Visit https://github.com/JustinBeckwith/gaxios.
//   // const url = 'https://people.googleapis.com/v1/people/me?personFields=names,photos,coverPhotos';
//   // const res = await oAuth2Client.request({url});
//   // console.log(res.data);
//   // // After acquiring an access_token, you may want to check on the audience, expiration,
//   // // or original scopes requested.  You can do that with the `getTokenInfo` method.
//   // const tokenInfo: any = await oAuth2Client.getTokenInfo(
//   //   oAuth2Client.credentials.access_token
//   // );
//   // console.log(tokenInfo);
//   const oAuth2Client = new OAuth2Client(
//     keys.web.client_id,
//     keys.web.client_secret,
//     keys.web.redirect_uris[0]
//   );
//   // const r = await oAuth2Client.getToken('4/wgHCAjSmPTDi9_hdzqi3ECy56-2zNScsNLncea83OIh_plZ2AGEqKNR87YtyynRekXXHjKzCNnM0yN0GR95PgT0');
//   // Make sure to set the credentials on the OAuth2 client.
//   // console.log(r)
//   oAuth2Client.setCredentials({
//     access_token: 'ya29.Il-9BxKYFIi3FweUZ7G3wK6TO29KYEzgokoB95g6_Ni4VLwEn-A6flg8wJlY8x7k6IyvWszIFNZtUYKZfSZ6-NGVM3Gfg4VLgsc8VDarbWVzV8tZ0o-Hp0qt3niYDVwa8g',
//     refresh_token: '1//0h_x9c5fzI5NnCgYIARAAGBESNwF-L9Ir4KjtdlKdiK9k2pEMk_oQ4IG3cqCVBebnhIYrD-qrELDsXAxnF36ekKXa3BHbRZTElss',
//     scope: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.profile',
//     token_type: 'Bearer',
//     id_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc2MmZhNjM3YWY5NTM1OTBkYjhiYjhhNjM2YmYxMWQ0MzYwYWJjOTgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzMDU4MzU1MDY5OTAtZDhlMmhtZmRjNGRncm4wMDEzaWViZ2c5Ym1ucXBiYmIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIzMDU4MzU1MDY5OTAtZDhlMmhtZmRjNGRncm4wMDEzaWViZ2c5Ym1ucXBiYmIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTc0ODMyMzE5ODMwNzA0NTA0MzkiLCJhdF9oYXNoIjoid0tNSktmY192bmVpdWp1TVlhbVhkdyIsIm5hbWUiOiJMZW9uYXJkbyBEJ0FudG9uaSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQUF1RTdtQURjc3Y2WDJpSy1UZk54S1VPT1R0Smx4emNhSGVUWHM1TDlfLTA9czk2LWMiLCJnaXZlbl9uYW1lIjoiTGVvbmFyZG8iLCJmYW1pbHlfbmFtZSI6IkQnQW50b25pIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE1ODE5OTcxODEsImV4cCI6MTU4MjAwMDc4MX0.LvwyY1a37sEWBZ-YJV1tS8uOrmLQ2k5aMe7E73KDCuq0R7M-pjwI8KUUJ5mf5ajpUKhj3YQFoq5xBBJGOd4Zkngs03jIioeOHb959hwAmbg6K9b7dpWzNy_dY0pySMNX69s_AOc-vM_MeuCeJRZPNZq6D4wxzYVgexWrf-VJm0xma7jcjt9n0r5FCX3nuX7Mvx1IgE9oCW8oxxk97DEiz76xV4nBBTmUMwLq9N8uJivxc0Fo1UD0bL9CZf90jmVhqanrotILPeIp2rYgDGf1RfF9-HaoRzXg7bX1avySB1q8bv2TI4jamTGNaqCEz_u0-AZyO-YlKUgVjWwg2Mq9wQ',
//     expiry_date: 1582000781036
//   });
//   let url = 'https://people.googleapis.com/v1/people/me?personFields=names,photos,coverPhotos';
//   let res = await oAuth2Client.request({url});
//   console.log(res.data);
//   url ='https://www.googleapis.com/drive/v3/files?fields=files(name, webViewLink)'; // + encodeURIComponent('title,characteristics/length');
//   res = await oAuth2Client.request({url});
//   console.log('FILES: ', res.data);
//   const tokenInfo: any = await oAuth2Client.getTokenInfo(
//     oAuth2Client.credentials.access_token
//   );
//   console.log(tokenInfo);
// }
// /**
//  * Create a new OAuth2Client, and go through the OAuth2 content
//  * workflow.  Return the full client to the callback.
//  */
// function getAuthenticatedClient() {
//   return new Promise((resolve, reject) => {
//     // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
//     // which should be downloaded from the Google Developers Console.
//     const oAuth2Client = new OAuth2Client(
//       keys.web.client_id,
//       keys.web.client_secret,
//       keys.web.redirect_uris[1]
//     );
//     // Generate the url that will be used for the consent dialog.
//     const authorizeUrl = oAuth2Client.generateAuthUrl({
//       access_type: 'offline',
//       scope: [
//         'https://www.googleapis.com/auth/drive',
//         'https://www.googleapis.com/auth/userinfo.profile'
//       ],
//       prompt: 'consent'
//     });
//     // Open an http server to accept the oauth callback. In this simple example, the
//     // only request to our webserver is to /oauth2callback?code=<code>
//     const server = http
//       .createServer(async (req: any, res: any) => {
//         try {
//           if (req.url.indexOf('/oauth2callback') > -1) {
//             // acquire the code from the querystring, and close the web server.
//             const qs = new url.URL(req.url, 'http://localhost:5000')
//               .searchParams;
//             const code = qs.get('code');
//             console.log(`Code is ${code}`);
//             res.end('Authentication successful! Please return to the console.');
//             server.destroy();
//             // Now that we have the code, use that to acquire tokens.
//             const r = await oAuth2Client.getToken(code);
//             console.log(r)
//             // Make sure to set the credentials on the OAuth2 client.
//             oAuth2Client.setCredentials(r.tokens);
//             console.info('Tokens acquired.');
//             resolve(oAuth2Client);
//           }
//         } catch (e) {
//           reject(e);
//         }
//       })
//       .listen(5000, () => {
//         // open the browser to the authorize url to start the workflow
//         openAux(authorizeUrl, {wait: false}).then((cp: any) => cp.unref());
//       });
//     destroyer(server);
//   });
// }
// main().catch(console.error);
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const googleapis_1 = require("googleapis");
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
    if (err)
        return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    // authorize(JSON.parse(content), listFiles);
    // authorize(JSON.parse(content), createTextFile);
    authorize(JSON.parse(content), uploadFile);
});
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err)
            return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}
/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err)
                return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err)
                    return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}
/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
    const drive = google.drive({ version: 'v3', auth });
    drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
    }, (err, res) => {
        if (err)
            return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length) {
            console.log('Files:');
            files.map((file) => {
                console.log(`${file.name} (${file.id})`);
            });
        }
        else {
            console.log('No files found.');
        }
    });
}
async function createTextFile(oauth2Client) {
    const drive = google.drive({
        version: 'v3',
        auth: oauth2Client
    });
    const res = await drive.files.create({
        requestBody: {
            name: 'Test',
            mimeType: 'text/plain'
        },
        media: {
            mimeType: 'text/plain',
            body: 'Hello World'
        }
    });
    console.log('createTextFile ', res);
}
async function uploadFile(oauth2Client) {
    const drive = new googleapis_1.drive_v3.Drive({ auth: oauth2Client });
    // const drive = google.drive({
    //   version: 'v3',
    //   auth: oauth2Client
    // });
    const res = await drive.files.create({
        requestBody: {
            parents: ['1axRoaSMayKRWALMU15Xo5OGc1Cn2VM9x'],
            name: 'image_upload_test.jpg',
            mimeType: 'image/jpg'
        },
        media: {
            mimeType: 'image/jpg',
            body: fs.createReadStream('image_upload.jpg')
        }
    });
    console.log('uploadFile ', res.data);
}
