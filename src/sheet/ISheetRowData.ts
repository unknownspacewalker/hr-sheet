import { EPriority } from "./EPriority";

interface Interview {
  Date: Date;
  CandidateFullName: string;
  toString: () => string;
}

export default interface ISheetRowData {
  DM: string;
  Availability: string;
  DeveloperId: number;
  Developer: string;
  Location: string;
  Grade: string;
  English: boolean;
  Priority: EPriority;
  OnBoarded: Interview;
  Experience: Interview[];
  Total: number;
  PlannedInterviews: Interview[];
  toString: () => string;
}
