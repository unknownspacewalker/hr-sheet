import ISheetRowData from './ISheetRowData';

const comparePriorityAsc = (
  firstData: ISheetRowData,
  secondData: ISheetRowData,
): number => (
  (firstData.Priority - secondData.Priority)
    || (Number(secondData.Willingness) - Number(firstData.Willingness))
    || (firstData.PlannedInterviews.length - secondData.PlannedInterviews.length)
);

export default comparePriorityAsc;
