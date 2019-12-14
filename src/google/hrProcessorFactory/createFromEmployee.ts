import EmployeeInterface from '../../interfaces/EmployeeInterface';
import SheetRowDataInterface from './SheetRowDataInterface';
import concatIfNotNull from '../utils/concatIfNotNull';
import parsePriority from '../utils/parsePriority';

const createFromEmployee = (
  employee: EmployeeInterface
): SheetRowDataInterface => ({
  DM: employee.manager ? employee.manager : 'N/A',
  Availability: '',
  DeveloperId: employee.id,
  Developer: concatIfNotNull(' ', employee.firstName, employee.familyName),
  Location: employee.location,
  Grade: concatIfNotNull('', employee.track, employee.level),
  English: false,
  React: employee.skills.ReactJS,
  Angular: employee.skills.Angular,
  NodeJS: employee.skills.NodeJS,
  Willingness: false,
  Priority: parsePriority(employee.priority),
  PlannedInterviews: [],
});

export default createFromEmployee;
