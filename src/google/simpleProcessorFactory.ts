import GoogleWrapper from './GoogleWrapper';
import { ISheetRawRow } from './interfaces/ISheetRaw';
import CommonProcessor from './CommonProcessor';
import reduceToMapByDeveloperId from './utils/reduceToMapByDeveloperId';
import concatIfNotNull from './utils/concatIfNotNull';
import IEmployee from '../interfaces/IEmployee';

export interface NameSheetData {
  DeveloperId: number;
  Developer: string;
  sheetData: string[];
}

const simpleProcessorFactory = (wrapper: GoogleWrapper): CommonProcessor<NameSheetData> => {
  const processor = new CommonProcessor<NameSheetData>(wrapper);

  processor.parseRowData = (rowData: ISheetRawRow): NameSheetData => {
    const [DeveloperId, Developer, ...sheetData] = rowData;

    return { DeveloperId: Number(DeveloperId), Developer, sheetData };
  };

  processor.createPopulate = (sheetData: NameSheetData[]):
    ((sheetData: NameSheetData) => NameSheetData) => {
    const developerMap = reduceToMapByDeveloperId(sheetData);

    return (employee: NameSheetData): NameSheetData => {
      if (developerMap.has(employee.DeveloperId)) {
        const developer = developerMap.get(employee.DeveloperId);
        return { ...employee, sheetData: developer.sheetData };
      }
      return { ...employee };
    };
  };

  processor.createFromEmployee = (employee: IEmployee): NameSheetData => ({
    DeveloperId: employee.id,
    Developer: concatIfNotNull(' ', employee.firstName, employee.familyName),
    sheetData: [],
  });

  processor.compare = (value1: NameSheetData, value2: NameSheetData): number => (
    value1.sheetData.length - value2.sheetData.length
  );


  processor.formatRowData = (rowData: NameSheetData): ISheetRawRow => [
    rowData.DeveloperId.toString(),
    rowData.Developer,
    ...rowData.sheetData,
  ];

  return processor;
};

export default simpleProcessorFactory;
