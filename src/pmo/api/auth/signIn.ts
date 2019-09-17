import cookie from 'cookie';
import dotenv from 'dotenv';
import qs from 'querystring';
import http from 'http';

dotenv.config();

const { HOST, LOGIN, PASSWORD } = process.env;

function signIn(): Promise<string | Error> {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      hostname: HOST,
      port: '8080',
      path: '/j_spring_security_check',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        accept: 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      const chunks = [];

      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        resolve(cookie.parse(res.headers['set-cookie'][0]).JSESSIONID);
      });

      res.on('error', (error) => {
        reject(error);
      });
    });

    req.write(qs.stringify({ j_username: LOGIN, j_password: PASSWORD }));
    req.end();
  });
}

export default signIn;
