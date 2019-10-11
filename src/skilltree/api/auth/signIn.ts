import dotenv from 'dotenv';
import http from 'https';

dotenv.config();

// const { HOST, LOGIN, PASSWORD } = process.env;

function signIn(): Promise<string> {
  return new Promise((resolve, reject) => {
    const options = {
      'method': 'POST',
      'hostname': 'sso.griddynamics.net',
      'path': '/auth/token/ldap',
      'headers': {
        'content-type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      const chunks: Uint8Array[] = [];

      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const body = Buffer.concat(chunks);
        console.log('sign in status:', res.statusCode);
        resolve(JSON.parse(body.toString()).accessToken);
      });

      res.on('error', (error) => {
        reject(error);
      });
    });

    req.write(JSON.stringify({
      userName: 'hr-google-sheet-sync-robot',
      encodedPassword: 'S3lFOW55OE1KY0ZpIQ==',
    }));
    req.end();
  });
}

export default signIn;
