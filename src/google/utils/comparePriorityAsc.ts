import ISheetRowData from '../interfaces/ISheetRowData';

const comparePriorityAsc = (
  firstData: ISheetRowData,
  secondData: ISheetRowData,
): number => firstData.Priority - secondData.Priority;

export default comparePriorityAsc;
