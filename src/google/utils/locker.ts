import { google } from 'googleapis';
import client from '../auth/client';

const unlockFactory = (
  sheetId: string,
  protectedRangeId: number,
  /* disable bugged inspection. False-positive with typescript here */
  /* eslint-disable-next-line function-paren-newline */
): (() => Promise<void>) => (
  async () => {
    const sheets = google.sheets('v4');

    await sheets.spreadsheets.batchUpdate({
      auth: await client,
      spreadsheetId: sheetId,
      requestBody: {
        requests: [{
          deleteProtectedRange: {
            protectedRangeId,
          },
        }],
      },
    });
  }
);

const lockTable = async (sheetId: string, pageId: number): Promise<number> => {
  const sheets = google.sheets('v4');

  const { data: { replies: [{ addProtectedRange }] } } = await sheets.spreadsheets.batchUpdate({
    auth: await client,
    spreadsheetId: sheetId,
    requestBody: {
      requests: [{
        addProtectedRange: {
          protectedRange: {
            description: `Lock from pmo bot ${(new Date()).toString()}`,
            requestingUserCanEdit: true,
            range: {
              sheetId: pageId,
            },
          },
        },
      }],
    },
  });

  return addProtectedRange.protectedRange.protectedRangeId;
};

const lock = async (SHEET_ID: string, PAGE_ID: number): Promise<(() => void)> => (
  unlockFactory(SHEET_ID, await lockTable(SHEET_ID, PAGE_ID))
);

export default lock;
