import { google } from 'googleapis';

function fromToken(token: string) {
  const jwtClient = new google.auth.JWT();
  jwtClient.fromJSON(JSON.parse(token));
  return jwtClient.createScoped([
    'https://www.googleapis.com/auth/spreadsheets',
  ]);
}

export { fromToken };
