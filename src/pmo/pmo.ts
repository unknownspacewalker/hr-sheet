import { parse, isAfter, subMonths } from 'date-fns';
import signIn from './api/auth/signIn';
import getAllActive from './api/employees/getAllActive';
import getEmployeeProjects from './api/employees/getEmployeeProjects';
import getPriority from './utils/getPriority';
import promiseAllWithBandWidth from './utils/promiseAllWithBandWidth';
import EmployeeInterface from '../interfaces/EmployeeInterface';
import { EViewPriority } from '../google/interfaces/EPriority';

type Props = {
  specialization?: 'UI' | 'HR';
};

class PMO {
  specialization: string;

  jsessionid: string;

  rawUIEngineers: IGetAllActiveResponse;

  employees: EmployeeInterface[];

  UIEngineers: EmployeeInterface[];

  constructor({ specialization = 'UI' }: Props = {}) {
    this.specialization = specialization;
    this.jsessionid = undefined;
    this.rawUIEngineers = undefined;
    this.UIEngineers = undefined;
  }

  auth = async function(): Promise<void> {
    this.jsessionid = await signIn();
  };

  getActiveUIEmployees = async function(): Promise<void> {
    const rawEmployees = await getAllActive(this.jsessionid);

    this.employees = rawEmployees.map(
      (employee: GetAllActiveResponseItemInterface): EmployeeInterface => ({
        id: employee.id,
        manager: employee.jobInfo.managerId,
        username: employee.general.username,
        firstName: employee.general.firstName,
        familyName: employee.general.familyName,
        track: employee.latestGrade.track,
        level: employee.latestGrade.level,
        location: employee.latestGrade.location,
        priority: EViewPriority.Bench,
        specialization: employee.latestGrade.specialization,
        skills: {},
        hiringDate: parse(
          employee.jobInfo.hiringDate,
          'yyyy-MM-dd',
          new Date()
        ),
      })
    );
  };

  filterTrial = (employee: EmployeeInterface): boolean =>
    !isAfter(employee.hiringDate, subMonths(new Date(), 3));

  populate = async function(
    employees: EmployeeInterface[],
    callback: () => void
  ): Promise<EmployeeInterface[]> {
    return promiseAllWithBandWidth(
      employees.map((employee: EmployeeInterface): (() => Promise<
        EmployeeInterface
      >) => async (): Promise<EmployeeInterface> => ({
        ...employee,
        priority: getPriority(
          await getEmployeeProjects(
            employee.username,
            this.jsessionid,
            callback
          )
        ),
      }))
    );
  };
}

export default PMO;
