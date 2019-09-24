import { google } from 'googleapis';
import dotenv from 'dotenv';

import client from './auth/client';
import ISheetData from './interfaces/ISheetData';
import formatRowData from './utils/formatRowData';
import notService from './utils/notService';
import IEmployee from '../interfaces/IEmployee';
import populateByMap from './utils/populateByMap';
import createFromEmployee from './utils/createFromEmployee';
import reduceToMapByDeveloperId from './utils/reduceToMapByDeveloperId';
import comparePriorityAsc from './utils/comparePriorityAsc';
import parseRowData from './utils/parseRowData';
import locker from './utils/locker';

dotenv.config();

const { SHEET_ID, PAGE_ID, PAGE_NAME } = process.env;


class Google {
  fetchCurrentData = async (): Promise<string[][]> => {
    const resolvedClient = await client;

    const sheets = google.sheets('v4');
    const { data: { values } } = (await sheets.spreadsheets.values.get({
      auth: resolvedClient,
      spreadsheetId: SHEET_ID,
      range: `${PAGE_NAME}!A2:Q`,
    }));

    await sheets.spreadsheets.values.batchClear({
      auth: resolvedClient,
      spreadsheetId: SHEET_ID,
      requestBody: {
        ranges: [`${PAGE_NAME}!A2:Q`],
      },
    });

    return values || [];
  };

  writeSheet = async (data: ISheetData) => {
    const sheets = google.sheets('v4');
    return sheets.spreadsheets.values.batchUpdate({
      auth: await client,
      spreadsheetId: SHEET_ID,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: [
          {
            range: `${PAGE_NAME}!A2:Q`,
            values: data.rows.map(formatRowData),
          },
        ],
      },
    });
  };

  fetchSheetData = async (): Promise<ISheetData> => ({
    rows: (await this.fetchCurrentData()).filter(notService).map(parseRowData),
  });

  sync = async (employees: IEmployee[]) => {
    const unlock = await locker(SHEET_ID, Number(PAGE_ID));

    try {
      const sheetData = await this.fetchSheetData();

      this.writeSheet({
        rows: employees
          .map(createFromEmployee)
          .map(populateByMap(reduceToMapByDeveloperId(sheetData.rows)))
          .sort(comparePriorityAsc),
      });
    } finally {
      await unlock();
    }
  };
}

export default Google;
