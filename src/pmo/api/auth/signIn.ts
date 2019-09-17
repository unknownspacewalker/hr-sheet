import cookie from 'cookie';

import qs from 'querystring';
import * as http from 'http';

function signIn(): Promise<string | Error> {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      hostname: 'internaltools.pmo.aws.griddynamics.net',
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

    req.write(qs.stringify({ j_username: 'pmo-bot', j_password: 'pmo-bot' }));
    req.end();
  });
}

export default signIn;
