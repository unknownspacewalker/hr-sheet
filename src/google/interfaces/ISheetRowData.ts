import { EPriority } from './EPriority';
// import IEvent from './IEvent';

export default interface ISheetRowData {
  DM: string;
  Availability: string;
  DeveloperId: number;
  Developer: string;
  Location: string;
  Grade: string;
  English: boolean;
  React: boolean;
  Angular: boolean;
  NodeJS: boolean;
  Willingness: boolean;
  Priority: EPriority;
  /** @todo use Event */
  PlannedInterviews: string[];
}
