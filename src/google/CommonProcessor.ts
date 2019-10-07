import IEmployee from '../interfaces/IEmployee';
import GoogleWrapper from './GoogleWrapper';
import { ISheetRaw, ISheetRawRow } from './interfaces/ISheetRaw';

class CommonProcessor<SheetDataType> {
  constructor(private wrapper: GoogleWrapper) { }

  parseRowData: (rowData: ISheetRawRow) => SheetDataType;

  createPopulate: (sheetData: SheetDataType[]) => ((sheetData: SheetDataType) => SheetDataType);

  createFromEmployee: (employee: IEmployee) => SheetDataType;

  compare: (value1: SheetDataType, values2: SheetDataType) => number;

  formatRowData: (rowData: SheetDataType) => ISheetRawRow;

  sync = async (employees: IEmployee[]) => {
    await this.wrapper.sync(async (parameter: ISheetRaw) => {
      const employeesFromSheet = parameter.map(this.parseRowData);

      return employees
        .map(this.createFromEmployee)
        .map(this.createPopulate(employeesFromSheet))
        .sort(this.compare)
        .map(this.formatRowData);
    });
  };
}

export default CommonProcessor;
