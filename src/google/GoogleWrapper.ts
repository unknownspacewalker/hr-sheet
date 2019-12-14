/* eslint-disable no-empty-function */
import { google, sheets_v4 as sheetsV4 } from 'googleapis';

import client from './auth/client';
import locker from './utils/locker';
import { SheetRawInterface } from './interfaces/SheetRawInterface';

class GoogleWrapper {
  constructor(
    private sheetId: string,
    private pageId: number,
    private pageName: string,
    private pageWithHeading: boolean = true,
    private firstColumnName: string = 'A',
    private lastColumnName: string = 'Z'
  ) {}

  fetch = async (): Promise<SheetRawInterface> => {
    const resolvedClient = await client;

    const sheets = google.sheets('v4');
    const {
      data: { values },
    } = await sheets.spreadsheets.values.get({
      auth: resolvedClient,
      spreadsheetId: this.sheetId,
      range: this.createRange(),
    });

    await sheets.spreadsheets.values.batchClear({
      auth: resolvedClient,
      spreadsheetId: this.sheetId,
      requestBody: {
        ranges: [this.createRange()],
      },
    });

    return values || [];
  };

  write = async (data: SheetRawInterface) => {
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
        includeValuesInResponse: true,
      },
    });
  };

  setValidation = async (
    range: sheetsV4.Schema$GridRange,
    rule: sheetsV4.Schema$DataValidationRule
  ) => {
    const sheets = google.sheets('v4');
    return sheets.spreadsheets.batchUpdate({
      auth: await client,
      spreadsheetId: this.sheetId,
      requestBody: {
        requests: [
          {
            setDataValidation: {
              range: {
                sheetId: this.pageId,
                ...range,
              },
              rule: { ...rule },
            },
          },
        ],
      },
    });
  };

  sync = async (
    process: (parameter: SheetRawInterface) => Promise<SheetRawInterface>
  ) => {
    const unlock = await locker(this.sheetId, this.pageId);

    try {
      return this.write(await process(await this.fetch()));
    } finally {
      await unlock();
    }
  };

  private createRange = () =>
    `${this.pageName}!${this.firstColumnName}${this.pageWithHeading ? 2 : 1}:${
      this.lastColumnName
    }`;
}

export default GoogleWrapper;
