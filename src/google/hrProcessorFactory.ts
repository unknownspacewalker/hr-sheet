import GoogleWrapper from './GoogleWrapper';
import { ISheetRawRow } from './interfaces/ISheetRaw';
import CommonProcessor from './CommonProcessor';
import IEmployee from '../interfaces/IEmployee';

import ISheetRowData from './interfaces/ISheetRowData';
import formatRowData from './utils/formatRowData';
import populateByMap from './utils/populateByMap';
import createFromEmployee from './utils/createFromEmployee';
import reduceToMapByDeveloperId from './utils/reduceToMapByDeveloperId';
import comparePriorityAsc from './utils/comparePriorityAsc';
import parseRowData from './utils/parseRowData';

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


  processor.formatRowData = (rowData: ISheetRowData): ISheetRawRow => formatRowData(rowData);

  return processor;
};

export default hrProcessorFactory;
