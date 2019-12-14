/* eslint-disable no-empty-function */
import EmployeeInterface from '../interfaces/EmployeeInterface';
import GoogleWrapper from './GoogleWrapper';
import {
  SheetRawInterface,
  SheetRawRowInterface,
} from './interfaces/SheetRawInterface';

class CommonProcessor<SheetDataType> {
  constructor(public wrapper: GoogleWrapper) {}

  parseRowData: (rowData: SheetRawRowInterface) => SheetDataType;

  createPopulate: (
    sheetData: SheetDataType[]
  ) => (sheetData: SheetDataType) => SheetDataType;

  createFromEmployee: (employee: EmployeeInterface) => SheetDataType;

  compare: (value1: SheetDataType, values2: SheetDataType) => number;

  createFormatRowData: (
    sheetData: SheetDataType[]
  ) => (rowData: SheetDataType) => SheetRawRowInterface;

  sync = async (employees: EmployeeInterface[]) =>
    this.wrapper.sync(async (parameter: SheetRawInterface) => {
      const employeesFromSheet = parameter.map(this.parseRowData);

      return employees
        .map(this.createFromEmployee)
        .map(this.createPopulate(employeesFromSheet))
        .sort(this.compare)
        .map(this.createFormatRowData(employeesFromSheet));
    });
}

export default CommonProcessor;
