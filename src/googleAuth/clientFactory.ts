import { google } from "googleapis";
import { promises as fsPromises } from "fs";

function fromToken(token: string) {
  const oAuth2Client = new google.auth.OAuth2();

  oAuth2Client.setCredentials(JSON.parse(token));

  return oAuth2Client;
}

async function fromFile(tokenPath: string) {
  let token = await fsPromises.readFile(tokenPath);

  return fromToken(token.toString());
}

export { fromToken, fromFile };
