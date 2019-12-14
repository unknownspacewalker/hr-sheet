import SheetRowDataInterface from './SheetRowDataInterface';
import populateWithUserInput from './populateWithUserInput';

const populateByMap = (
  sheetDataMap: Map<number, SheetRowDataInterface>
): ((value: SheetRowDataInterface) => SheetRowDataInterface) => (
  value: SheetRowDataInterface
): SheetRowDataInterface =>
  sheetDataMap.get(value.DeveloperId)
    ? populateWithUserInput(value, sheetDataMap.get(value.DeveloperId))
    : { ...value };

export default populateByMap;
