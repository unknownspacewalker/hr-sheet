import GoogleWrapper from '../GoogleWrapper';
import { SheetRawRowInterface } from '../interfaces/SheetRawInterface';
import CommonProcessor from '../CommonProcessor';
import EmployeeInterface from '../../interfaces/EmployeeInterface';

import SheetRowDataInterface from '../interfaces/SheetRowDataInterface';
import createFormatRowData from './createFormatRowData';
import populateByMap from './populateByMap';
import createFromEmployee from './createFromEmployee';
import reduceToMapByDeveloperId from '../utils/reduceToMapByDeveloperId';
import compareSheetRowData from './compareSheetRowData';
import parseRowData from './parseRowData';
import findMaxLength from '../utils/findMaxLength';

const hrProcessorFactory = (
  wrapper: GoogleWrapper
): CommonProcessor<SheetRowDataInterface> => {
  const processor = new CommonProcessor<SheetRowDataInterface>(wrapper);

  processor.parseRowData = (
    rowData: SheetRawRowInterface
  ): SheetRowDataInterface => parseRowData(rowData);

  processor.createPopulate = (
    sheetData: SheetRowDataInterface[]
  ): ((sheetData: SheetRowDataInterface) => SheetRowDataInterface) => {
    const developerMap = reduceToMapByDeveloperId(sheetData);

    return populateByMap(developerMap);
  };

  processor.createFromEmployee = (
    employee: EmployeeInterface
  ): SheetRowDataInterface => createFromEmployee(employee);

  processor.compare = (
    value1: SheetRowDataInterface,
    value2: SheetRowDataInterface
  ): number => compareSheetRowData(value1, value2);

  processor.createFormatRowData = (
    sheetData: SheetRowDataInterface[]
  ): ((rowData: SheetRowDataInterface) => SheetRawRowInterface) =>
    createFormatRowData(
      sheetData.length > 0
        ? findMaxLength(
            sheetData.map(
              (value: SheetRowDataInterface): any[] => value.PlannedInterviews
            )
          )
        : 0
    );

  processor.sync = new Proxy(processor.sync, {
    apply: (target, targetThis, applyArguments) => {
      const [employees]: [EmployeeInterface[]] = applyArguments;
      const result = Reflect.apply(target, targetThis, applyArguments);
      result.then((syncResult: any) => {
        processor.wrapper.setValidation(
          {
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
          }
        );
        return syncResult;
      });

      return result;
    },
  });

  return processor;
};

export default hrProcessorFactory;
