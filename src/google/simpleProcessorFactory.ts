import GoogleWrapper from './GoogleWrapper';
import { SheetRawRowInterface } from './interfaces/SheetRawInterface';
import CommonProcessor from './CommonProcessor';
import reduceToMapByDeveloperId from './utils/reduceToMapByDeveloperId';
import concatIfNotNull from './utils/concatIfNotNull';
import EmployeeInterface from '../interfaces/EmployeeInterface';

export interface NameSheetData {
  DeveloperId: number;
  Developer: string;
  sheetData: string[];
}

const simpleProcessorFactory = (
  wrapper: GoogleWrapper
): CommonProcessor<NameSheetData> => {
  const processor = new CommonProcessor<NameSheetData>(wrapper);

  processor.parseRowData = (rowData: SheetRawRowInterface): NameSheetData => {
    const [DeveloperId, Developer, ...sheetData] = rowData;

    return { DeveloperId: Number(DeveloperId), Developer, sheetData };
  };

  processor.createPopulate = (
    sheetData: NameSheetData[]
  ): ((sheetData: NameSheetData) => NameSheetData) => {
    const developerMap = reduceToMapByDeveloperId(sheetData);

    return (employee: NameSheetData): NameSheetData => {
      if (developerMap.has(employee.DeveloperId)) {
        const developer = developerMap.get(employee.DeveloperId);
        return { ...employee, sheetData: developer.sheetData };
      }
      return { ...employee };
    };
  };

  processor.createFromEmployee = (
    employee: EmployeeInterface
  ): NameSheetData => ({
    DeveloperId: employee.id,
    Developer: concatIfNotNull(' ', employee.firstName, employee.familyName),
    sheetData: [],
  });

  processor.compare = (value1: NameSheetData, value2: NameSheetData): number =>
    value1.sheetData.length - value2.sheetData.length;

  processor.createFormatRowData = (): ((
    rowData: NameSheetData
  ) => SheetRawRowInterface) => (
    rowData: NameSheetData
  ): SheetRawRowInterface => [
    rowData.DeveloperId.toString(),
    rowData.Developer,
    ...rowData.sheetData,
  ];

  return processor;
};

export default simpleProcessorFactory;
