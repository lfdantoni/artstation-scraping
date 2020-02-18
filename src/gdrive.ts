const {OAuth2Client, auth} = require('google-auth-library');
const http = require('http');
const url = require('url');
const openAux = require('open');
const destroyer = require('server-destroy');

// Download your OAuth2 configuration from the Google
const keys = require('./artstation-scraping-2542387682cf.json');

/**
 * Start by acquiring a pre-authenticated oAuth2 client.
 */
async function main() {
  // const oAuth2Client: any = await getAuthenticatedClient();

  // // Make a simple request to the People API using our pre-authenticated client. The `request()` method
  // // takes an GaxiosOptions object.  Visit https://github.com/JustinBeckwith/gaxios.
  // const url = 'https://people.googleapis.com/v1/people/me?personFields=names,photos,coverPhotos';
  // const res = await oAuth2Client.request({url});
  // console.log(res.data);

  // // After acquiring an access_token, you may want to check on the audience, expiration,
  // // or original scopes requested.  You can do that with the `getTokenInfo` method.
  // const tokenInfo: any = await oAuth2Client.getTokenInfo(
  //   oAuth2Client.credentials.access_token
  // );

  // console.log(tokenInfo);


  const oAuth2Client = new OAuth2Client(
    keys.web.client_id,
    keys.web.client_secret,
    keys.web.redirect_uris[0]
  );

  // const r = await oAuth2Client.getToken('4/wgHCAjSmPTDi9_hdzqi3ECy56-2zNScsNLncea83OIh_plZ2AGEqKNR87YtyynRekXXHjKzCNnM0yN0GR95PgT0');
  // Make sure to set the credentials on the OAuth2 client.
  // console.log(r)
  oAuth2Client.setCredentials({
    access_token: 'ya29.Il-9BxKYFIi3FweUZ7G3wK6TO29KYEzgokoB95g6_Ni4VLwEn-A6flg8wJlY8x7k6IyvWszIFNZtUYKZfSZ6-NGVM3Gfg4VLgsc8VDarbWVzV8tZ0o-Hp0qt3niYDVwa8g',
    refresh_token: '1//0h_x9c5fzI5NnCgYIARAAGBESNwF-L9Ir4KjtdlKdiK9k2pEMk_oQ4IG3cqCVBebnhIYrD-qrELDsXAxnF36ekKXa3BHbRZTElss',
    scope: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.profile',
    token_type: 'Bearer',
    id_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc2MmZhNjM3YWY5NTM1OTBkYjhiYjhhNjM2YmYxMWQ0MzYwYWJjOTgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzMDU4MzU1MDY5OTAtZDhlMmhtZmRjNGRncm4wMDEzaWViZ2c5Ym1ucXBiYmIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIzMDU4MzU1MDY5OTAtZDhlMmhtZmRjNGRncm4wMDEzaWViZ2c5Ym1ucXBiYmIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTc0ODMyMzE5ODMwNzA0NTA0MzkiLCJhdF9oYXNoIjoid0tNSktmY192bmVpdWp1TVlhbVhkdyIsIm5hbWUiOiJMZW9uYXJkbyBEJ0FudG9uaSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQUF1RTdtQURjc3Y2WDJpSy1UZk54S1VPT1R0Smx4emNhSGVUWHM1TDlfLTA9czk2LWMiLCJnaXZlbl9uYW1lIjoiTGVvbmFyZG8iLCJmYW1pbHlfbmFtZSI6IkQnQW50b25pIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE1ODE5OTcxODEsImV4cCI6MTU4MjAwMDc4MX0.LvwyY1a37sEWBZ-YJV1tS8uOrmLQ2k5aMe7E73KDCuq0R7M-pjwI8KUUJ5mf5ajpUKhj3YQFoq5xBBJGOd4Zkngs03jIioeOHb959hwAmbg6K9b7dpWzNy_dY0pySMNX69s_AOc-vM_MeuCeJRZPNZq6D4wxzYVgexWrf-VJm0xma7jcjt9n0r5FCX3nuX7Mvx1IgE9oCW8oxxk97DEiz76xV4nBBTmUMwLq9N8uJivxc0Fo1UD0bL9CZf90jmVhqanrotILPeIp2rYgDGf1RfF9-HaoRzXg7bX1avySB1q8bv2TI4jamTGNaqCEz_u0-AZyO-YlKUgVjWwg2Mq9wQ',
    expiry_date: 1582000781036
  });

  const url = 'https://people.googleapis.com/v1/people/me?personFields=names,photos,coverPhotos';
  const res = await oAuth2Client.request({url});
  console.log(res.data);

  const tokenInfo: any = await oAuth2Client.getTokenInfo(
    oAuth2Client.credentials.access_token
  );

  console.log(tokenInfo);
}

/**
 * Create a new OAuth2Client, and go through the OAuth2 content
 * workflow.  Return the full client to the callback.
 */
function getAuthenticatedClient() {
  return new Promise((resolve, reject) => {
    // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
    // which should be downloaded from the Google Developers Console.
    const oAuth2Client = new OAuth2Client(
      keys.web.client_id,
      keys.web.client_secret,
      keys.web.redirect_uris[1]
    );

    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/userinfo.profile'
      ],
      prompt: 'consent'
    });

    // Open an http server to accept the oauth callback. In this simple example, the
    // only request to our webserver is to /oauth2callback?code=<code>
    const server = http
      .createServer(async (req: any, res: any) => {
        try {
          if (req.url.indexOf('/oauth2callback') > -1) {
            // acquire the code from the querystring, and close the web server.
            const qs = new url.URL(req.url, 'http://localhost:5000')
              .searchParams;
            const code = qs.get('code');
            console.log(`Code is ${code}`);
            res.end('Authentication successful! Please return to the console.');
            server.destroy();

            // Now that we have the code, use that to acquire tokens.
            const r = await oAuth2Client.getToken(code);
            console.log(r)
            // Make sure to set the credentials on the OAuth2 client.
            oAuth2Client.setCredentials(r.tokens);
            console.info('Tokens acquired.');
            resolve(oAuth2Client);
          }
        } catch (e) {
          reject(e);
        }
      })
      .listen(5000, () => {
        // open the browser to the authorize url to start the workflow
        openAux(authorizeUrl, {wait: false}).then((cp: any) => cp.unref());
      });
    destroyer(server);
  });
}

main().catch(console.error);
