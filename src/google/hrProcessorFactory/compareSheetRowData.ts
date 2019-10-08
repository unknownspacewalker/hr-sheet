import ISheetRowData from './ISheetRowData';

const comparePriorityAsc = (
  firstData: ISheetRowData,
  secondData: ISheetRowData,
): number => (
  (firstData.Priority - secondData.Priority)
    || (Number(firstData.Willingness) - Number(secondData.Willingness))
);

export default comparePriorityAsc;
