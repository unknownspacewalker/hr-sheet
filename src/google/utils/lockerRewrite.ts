import { google, sheets_v4 as sheetsV4 } from 'googleapis';
import client from '../auth/client';
import { when, find } from 'ramda';

const PMO_BOT_LOCK_PREFIX = 'Lock from pmo bot';

const isSelfLock = (protectedRange: sheetsV4.Schema$ProtectedRange): boolean =>
  protectedRange.description &&
  protectedRange.description.startsWith(PMO_BOT_LOCK_PREFIX);

const failOnSelfLock = when(isSelfLock, () => {
  throw new Error('Self lock found');
});

const unlockFactory = (
  sheetId: string,
  protectedRangeId: number
  /* disable bugged inspection. False-positive with typescript here */
  /* eslint-disable-next-line function-paren-newline */
): (() => Promise<void>) => async () => {
  const sheets = google.sheets('v4');

  await sheets.spreadsheets.batchUpdate({
    auth: await client,
    spreadsheetId: sheetId,
    requestBody: {
      requests: [
        {
          deleteProtectedRange: {
            protectedRangeId,
          },
        },
      ],
    },
  });
};

const lockTable = async (sheetId: string, pageId: number): Promise<number> => {
  const sheets = google.sheets('v4');
  let previousLock: sheetsV4.Schema$ProtectedRange[] = [];
  try {
    const {
      data: {
        replies: [{ addProtectedRange }],
      },
    } = await sheets.spreadsheets.batchUpdate({
      auth: await client,
      spreadsheetId: sheetId,
      requestBody: {
        requests: [
          {
            addProtectedRange: {
              protectedRange: {
                description: `${PMO_BOT_LOCK_PREFIX} ${new Date().toString()}`,
                requestingUserCanEdit: true,
                range: {
                  sheetId: pageId,
                },
              },
            },
          },
        ],
      },
    });

    return addProtectedRange.protectedRange.protectedRangeId;
  } catch (error) {
    throw error;
    const sheetInfo = await sheets.spreadsheets.get({
      auth: await client,
      spreadsheetId: sheetId,
      includeGridData: true,
    });
    previousLock = find(
      sheet => sheet.properties.sheetId === pageId,
      sheetInfo.data.sheets
    ).protectedRanges;

    previousLock.forEach(failOnSelfLock);

    previousLock.forEach(protectedRange => {
      unlockFactory(sheetId, protectedRange.protectedRangeId)();
    });
  }
};

const lock = async (SHEET_ID: string, PAGE_ID: number): Promise<() => void> =>
  unlockFactory(SHEET_ID, await lockTable(SHEET_ID, PAGE_ID));

export default lock;
