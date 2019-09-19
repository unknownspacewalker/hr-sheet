import { EPriority } from './EPriority';
import IEvent from './IEvent';

export default interface ISheetRowData {
  DM: string;
  Availability: string;
  DeveloperId: number;
  Developer: string;
  Location: string;
  Grade: string;
  English: boolean;
  Priority: EPriority;
  OnBoarded?: IEvent;
  Experience: IEvent[];
  Total: number;
  PlannedInterviews: IEvent[];
}
