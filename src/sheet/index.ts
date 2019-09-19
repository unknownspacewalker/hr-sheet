import dotenv from "dotenv";
import { google } from "googleapis";
import client from "../googleAuth/client";
import ISheetRowData from "./ISheetRowData";
import { EPriority, EViewPriority } from "./EPriority";
import IEvent from "./IEvent";
import ISheetData from "./ISheetData";

interface Remote {
  
}

dotenv.config();

const { SHEET_ID, PAGE_NAME } = process.env;

const fetchCurrentData = async (): Promise<string[][]> => {
  const resolvedClient = await client;

  const sheets = google.sheets("v4");
  return (await sheets.spreadsheets.values.get({
    auth: resolvedClient,
    spreadsheetId: SHEET_ID,
    range: `${PAGE_NAME}!A2:P`
  })).data.values;
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
  const {
    groups: { year, month, day, name }
  } = /^(?<day>\d{2}).(?<month>\d{2}).(?<year>\d{4}) \((?<name>\w+\s\w+)\)$/gm.exec(
    event
  );

  return {
    date: new Date(Number(year), Number(month), Number(day)),
    fullName: name
  };
};

const formatEvent = (event: IEvent): string =>
  `${event.date.getDay()}.${event.date.getMonth()}.${event.date.getFullYear()} (${
    event.fullName
  })`;

const notEmpty = (value: string): boolean => value.length > 0;

/** Service rows uses columns before "J" :) */
const notService = (value: string[]): boolean => value.length >= 10;

const comparePriorityAsc = (
  firstData: ISheetRowData,
  secondData: ISheetRowData
): number => {
  return firstData.Priority - secondData.Priority;
};

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
    ,
    ...PlannedInterviews
  ] = data;

  return {
    DM,
    Availability,
    DeveloperId: 0,
    Developer,
    Location,
    Grade,
    English: English === "yes",
    Priority: parsePriority(Priority),
    OnBoarded: OnBoarded ? parseEvent(OnBoarded) : null,
    Experience: Experience.length
      ? Experience.split(/\r?\n/).map(parseEvent)
      : [],
    Total: PlannedInterviews.length,
    PlannedInterviews: PlannedInterviews.length
      ? PlannedInterviews.filter(notEmpty).map(parseEvent)
      : []
  };
};

const formatRowData = (data: ISheetRowData): string[] => [
  data.DM,
  data.Availability,
  data.DeveloperId.toString(),
  data.Developer,
  data.Location,
  data.Grade,
  data.English ? "yes" : "no",
  data.Priority ? formatPriority(data.Priority) : "",
  data.OnBoarded ? formatEvent(data.OnBoarded) : "",
  data.Experience.map(formatEvent).join("\n"),
  data.PlannedInterviews.length.toString(),
  ...data.PlannedInterviews.map(formatEvent)
];

const writeSheet = async (data: ISheetData) => {
  const sheets = google.sheets("v4");
  return sheets.spreadsheets.values.batchUpdate({
    auth: await client,
    spreadsheetId: "1MmI-zciDNo6JEIerpWpkMgPQ901SqdMUmZTscII6Rnk",
    requestBody: {
      valueInputOption: "USER_ENTERED",
      data: [
        {
          range: "DemoSheet!A2:P",
          values: data.rows.map(formatRowData)
        }
      ]
    }
  });
};

const fetchSheetData = async (): Promise<ISheetData> => ({
  rows: (await fetchCurrentData()).filter(notService).map(parseRowData)
});

const createFromRemote()

export default async () => {
  const sheetData = await fetchSheetData();

  sheetData.rows.sort(comparePriorityAsc);

  writeSheet(sheetData);
};
