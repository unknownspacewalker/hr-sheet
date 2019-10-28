import ISheetRowData from './ISheetRowData';

const compareSheetRowData = (
  firstData: IComparable,
  secondData: IComparable,
): number => (
  (firstData.Priority - secondData.Priority)
    || (Number(secondData.Willingness) - Number(firstData.Willingness))
    || (firstData.PlannedInterviews.length - secondData.PlannedInterviews.length)
);

export default compareSheetRowData;

export interface IComparable {
  Priority: ISheetRowData['Priority'];
  Willingness: ISheetRowData['Willingness'];
  PlannedInterviews: ISheetRowData['PlannedInterviews'];
}
