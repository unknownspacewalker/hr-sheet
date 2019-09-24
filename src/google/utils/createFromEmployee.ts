import IEmployee from '../../interfaces/IEmployee';
import ISheetRowData from '../sheet/ISheetRowData';
import concatIfNotNull from '../sheet/concatIfNotNull';
import parsePriority from './parsePriority';

const createFromEmployee = (employee: IEmployee): ISheetRowData => ({
  DM: employee.manager ? employee.manager : 'N/A',
  Availability: '',
  DeveloperId: employee.id,
  Developer: concatIfNotNull(' ', employee.firstName, employee.familyName),
  Location: employee.location,
  Grade: concatIfNotNull('', employee.track, employee.level),
  English: false,
  Priority: parsePriority(employee.priority),
  OnBoarded: null,
  Experience: [],
  Total: 0,
  PlannedInterviews: [],
});

export default createFromEmployee;
