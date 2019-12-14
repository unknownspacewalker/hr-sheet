import SheetRowDataInterface from './SheetRowDataInterface';
import { EPriority } from '../interfaces/EPriority';

const INTERNAL_PROJECT_WEIGHT = 3;

const isOnBench = (sheetData: ComparableInterface): boolean =>
  sheetData.Priority === EPriority.Bench;

const calculateWeight = (sheetData: ComparableInterface): number =>
  sheetData.Priority === EPriority.InternalProject
    ? sheetData.PlannedInterviews.length
    : sheetData.PlannedInterviews.length * INTERNAL_PROJECT_WEIGHT;

const compareSheetRowData = (
  firstData: ComparableInterface,
  secondData: ComparableInterface
): number =>
  (isOnBench(firstData) || isOnBench(secondData)
    ? firstData.Priority - secondData.Priority
    : 0) ||
  Number(secondData.Willingness) - Number(firstData.Willingness) ||
  calculateWeight(firstData) - calculateWeight(secondData) ||
  firstData.Priority - secondData.Priority;

export default compareSheetRowData;

export interface ComparableInterface {
  Developer: SheetRowDataInterface['Developer'];
  Priority: SheetRowDataInterface['Priority'];
  Willingness: SheetRowDataInterface['Willingness'];
  PlannedInterviews: SheetRowDataInterface['PlannedInterviews'];
}
