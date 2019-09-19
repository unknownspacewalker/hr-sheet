import { google } from 'googleapis';
import dotenv from 'dotenv';
import client from '../googleAuth/client';
import ISheetRowData from './ISheetRowData';
import { EPriority, EViewPriority } from './EPriority';
import IEvent from './IEvent';
import ISheetData from './ISheetData';

dotenv.config();

const { SHEET_ID, PAGE_NAME } = process.env;

const fetchCurrentData = async (): Promise<string[][]> => {
  const resolvedClient = await client;

  return new Promise((resolve, reject) => {
    const sheets = google.sheets('v4');
    sheets.spreadsheets.values.get(
      {
        auth: resolvedClient,
        spreadsheetId: SHEET_ID,
        range: `${PAGE_NAME}!A2:P`,
      },
      (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res.data.values);
      },
    );
  });
};

const writeSheet = async (data: ISheetData) => {
  data.rows.map(formatRowData);
  const sheets = google.sheets('v4');
  sheets.spreadsheets.values.batchUpdate;
};

const parsePriority = (priority: string): EPriority => {
  switch (priority) {
    case EViewPriority.Bench:
      return EPriority.Bench;
    case EViewPriority.InternalProject:
      return EPriority.InternalProject;
    case EViewPriority.CustomerProject:
      return EPriority.CustomerProject;
    default:
      throw new Error(`Undefined priority ${priority}`);
  }
};

const formatPriority = (priority: number): EViewPriority => {
  switch (priority) {
    case EPriority.Bench:
      return EViewPriority.Bench;
    case EPriority.InternalProject:
      return EViewPriority.InternalProject;
    case EPriority.CustomerProject:
      return EViewPriority.CustomerProject;
    default:
      throw new Error(`Undefined priority ${priority}`);
  }
};

const parseEvent = (event: string): IEvent => {
  console.log('event: ', event);
  const {
    groups: {
      year, month, day, name,
    },
  } = /^(?<day>\d{2}).(?<month>\d{2}).(?<year>\d{4}) \((?<name>\w+\s\w+)\)$/gm.exec(
    event,
  );
  console.log('name: ', name);
  return {
    date: new Date(Number(year), Number(month), Number(day)),
    fullName: name,
  };
};

const formatEvent = (event: IEvent): string => `${event.date.getDay()}.${event.date.getMonth()}.${event.date.getFullYear()} (${
  event.fullName
})`;

const notEmpty = (value: string): boolean => value.length > 0;

/** Service rows uses columns before "J" :) */
const notService = (value: string[]): boolean => value.length >= 10;

const parseRowData = (data: string[]): ISheetRowData => {
  const [
    DM,
    Availability,
    // DeveloperId,
    Developer,
    Location,
    Grade,
    English,
    Priority,
    OnBoarded,
    Experience,
    Total,
    ...PlannedInterviews
  ] = data;

  return {
    DM,
    Availability,
    DeveloperId: 0,
    Developer,
    Location,
    Grade,
    English: English === 'yes',
    Priority: parsePriority(Priority),
    OnBoarded: OnBoarded ? parseEvent(OnBoarded) : null,
    Experience: Experience.length
      ? Experience.split(/\r?\n/).map(parseEvent)
      : [],
    Total: PlannedInterviews.length,
    PlannedInterviews: PlannedInterviews.length
      ? PlannedInterviews.filter(notEmpty).map(parseEvent)
      : [],
  };
};

const formatRowData = (data: ISheetRowData): string[] => [
  data.DM,
  data.Availability,
  data.DeveloperId.toString(),
  data.Developer,
  data.Location,
  data.Grade,
  data.English ? 'yes' : 'no',
  formatPriority(data.Priority),
  formatEvent(data.OnBoarded),
  data.Experience.map(formatEvent).join('\n'),
  data.PlannedInterviews.length.toString(),
  ...data.PlannedInterviews.map(formatEvent),
];

export default async () => {
  console.log((await fetchCurrentData()).filter(notService).map(parseRowData));
};
