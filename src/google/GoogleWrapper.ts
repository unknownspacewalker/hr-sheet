import { google } from 'googleapis';

import client from './auth/client';
import locker from './utils/locker';
import { ISheetRaw } from './interfaces/ISheetRaw';

class GoogleWrapper {
  constructor(
    private sheetId: string,
    private pageId: number,
    private pageName: string,
    private pageWithHeading: boolean = true,
    private firstColumnName: string = 'A',
    private lastColumnName: string = 'Z',
  ) { }

  fetch = async (): Promise<ISheetRaw> => {
    const resolvedClient = await client;

    const sheets = google.sheets('v4');
    const { data: { values } } = (await sheets.spreadsheets.values.get({
      auth: resolvedClient,
      spreadsheetId: this.sheetId,
      range: this.createRange(),
    }));

    await sheets.spreadsheets.values.batchClear({
      auth: resolvedClient,
      spreadsheetId: this.sheetId,
      requestBody: {
        ranges: [this.createRange()],
      },
    });

    return values || [];
  };

  write = async (data: ISheetRaw) => {
    const sheets = google.sheets('v4');
    return sheets.spreadsheets.values.batchUpdate({
      auth: await client,
      spreadsheetId: this.sheetId,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: [
          {
            range: this.createRange(),
            values: data,
          },
        ],
      },
    });
  };

  sync = async (process: (parameter: ISheetRaw) => Promise<ISheetRaw>) => {
    const unlock = await locker(this.sheetId, this.pageId);

    try {
      await this.write(await process(await this.fetch()));
    } finally {
      await unlock();
    }
  };

  private createRange = () => `${this.pageName}!${this.firstColumnName}${this.pageWithHeading ? 2 : 1}:${this.lastColumnName}`;
}

export default GoogleWrapper;
