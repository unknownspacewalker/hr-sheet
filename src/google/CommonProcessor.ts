/* eslint-disable no-empty-function */
import IEmployee from '../interfaces/IEmployee';
import GoogleWrapper from './GoogleWrapper';
import { ISheetRaw, ISheetRawRow } from './interfaces/ISheetRaw';

class CommonProcessor<SheetDataType> {
  constructor(public wrapper: GoogleWrapper) { }

  parseRowData: (rowData: ISheetRawRow) => SheetDataType;

  createPopulate: (sheetData: SheetDataType[]) => ((sheetData: SheetDataType) => SheetDataType);

  createFromEmployee: (employee: IEmployee) => SheetDataType;

  compare: (value1: SheetDataType, values2: SheetDataType) => number;

  createFormatRowData: (sheetData: SheetDataType[]) => ((rowData: SheetDataType) => ISheetRawRow);

  sync = async (employees: IEmployee[]) => (
    this.wrapper.sync(async (parameter: ISheetRaw) => {
      const employeesFromSheet = parameter.map(this.parseRowData);

      return employees
        .map(this.createFromEmployee)
        .map(this.createPopulate(employeesFromSheet))
        .sort(this.compare)
        .map(this.createFormatRowData(employeesFromSheet));
    })
  );
}

export default CommonProcessor;
