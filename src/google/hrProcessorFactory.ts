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
    createFormatRowData(
      sheetData.length > 0
        ? findMaxLength(sheetData.map((value: ISheetRowData): any[] => value.PlannedInterviews))
        : 0,
    )
  );

  processor.sync = new Proxy(processor.sync, {
    apply: (target, targetThis, applyArguments) => {
      const [employees]: [IEmployee[]] = applyArguments;
      const result = Reflect.apply(target, targetThis, applyArguments);
      result.then((syncResult: any) => {
        processor.wrapper.setValidation({
          startColumnIndex: 6,
          endColumnIndex: 11,
          startRowIndex: 1,
          endRowIndex: employees.length + 1,
        },
        {
          condition: {
            type: 'BOOLEAN',
            values: [],
          },
        });
        return syncResult;
      });


      return result;
    },
  });

  return processor;
};

export default hrProcessorFactory;
