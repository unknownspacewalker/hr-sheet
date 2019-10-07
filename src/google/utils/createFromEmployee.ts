import IEmployee from '../../interfaces/IEmployee';
import ISheetRowData from '../interfaces/ISheetRowData';
import concatIfNotNull from './concatIfNotNull';
import parsePriority from './parsePriority';

const createFromEmployee = (employee: IEmployee): ISheetRowData => ({
  DM: employee.manager ? employee.manager : 'N/A',
  Availability: '',
  DeveloperId: employee.id,
  Developer: concatIfNotNull(' ', employee.firstName, employee.familyName),
  Location: employee.location,
  Grade: concatIfNotNull('', employee.track, employee.level),
  English: false,
  React: false,
  Angular: false,
  NodeJS: false,
  Willingness: false,
  Priority: parsePriority(employee.priority),
  PlannedInterviews: [],
});

export default createFromEmployee;
