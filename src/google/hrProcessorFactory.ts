import GoogleWrapper from './GoogleWrapper';
import { ISheetRawRow } from './interfaces/ISheetRaw';
import CommonProcessor from './CommonProcessor';
import IEmployee from '../interfaces/IEmployee';

import ISheetRowData from './interfaces/ISheetRowData';
import createFormatRowData from './utils/createFormatRowData';
import populateByMap from './utils/populateByMap';
import createFromEmployee from './utils/createFromEmployee';
import reduceToMapByDeveloperId from './utils/reduceToMapByDeveloperId';
import comparePriorityAsc from './utils/comparePriorityAsc';
import parseRowData from './utils/parseRowData';
import findMaxLength from './utils/findMaxLength';

const hrProcessorFactory = (wrapper: GoogleWrapper): CommonProcessor<ISheetRowData> => {
  const processor = new CommonProcessor<ISheetRowData>(wrapper);

  processor.parseRowData = (rowData: ISheetRawRow): ISheetRowData => parseRowData(rowData);

  processor.createPopulate = (sheetData: ISheetRowData[]):
    ((sheetData: ISheetRowData) => ISheetRowData) => {
    const developerMap = reduceToMapByDeveloperId(sheetData);

    return populateByMap(developerMap);
  };

  processor.createFromEmployee = (employee: IEmployee): ISheetRowData => (
    createFromEmployee(employee)
  );

  processor.compare = (value1: ISheetRowData, value2: ISheetRowData): number => (
    comparePriorityAsc(value1, value2)
  );

  processor.createFormatRowData = (sheetData: ISheetRowData[]):
    ((rowData: ISheetRowData) => ISheetRawRow) => (
    createFormatRowData(findMaxLength(
      sheetData.map((value: ISheetRowData): any[] => value.PlannedInterviews),
    ))
  );

  return processor;
};

export default hrProcessorFactory;
