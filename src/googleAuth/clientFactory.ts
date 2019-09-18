import { google } from "googleapis";
import { promises as fsPromises } from "fs";

function fromToken(token: string) {
  const jwtClient = new google.auth.JWT();
  jwtClient.fromJSON(JSON.parse(token));
  return jwtClient.createScoped([
    "https://www.googleapis.com/auth/spreadsheets"
  ]);
}

async function fromFile(tokenPath: string) {
  let token = await fsPromises.readFile(tokenPath);

  return fromToken(token.toString());
}

export { fromToken, fromFile };
