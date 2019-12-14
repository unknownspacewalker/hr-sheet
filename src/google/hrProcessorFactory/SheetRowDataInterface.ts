import { EPriority } from '../interfaces/EPriority';
// import IEvent from './IEvent';

export default interface SheetRowDataInterface {
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
