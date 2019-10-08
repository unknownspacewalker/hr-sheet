import ISheetRowData from './ISheetRowData';
import populateWithUserInput from './populateWithUserInput';

const populateByMap = (
  sheetDataMap: Map<number, ISheetRowData>,
): ((value: ISheetRowData) => ISheetRowData
  ) => (value: ISheetRowData): ISheetRowData => (sheetDataMap.get(value.DeveloperId)
  ? populateWithUserInput(value, sheetDataMap.get(value.DeveloperId))
  : { ...value });

export default populateByMap;
