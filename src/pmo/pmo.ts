import signIn from './api/auth/signIn';
import getAllActive from './api/employees/getAllActive';
import getEmployeeProjects from './api/employees/getEmployeeProjects';
import getPriority from './utils/getPriority';
import promiseAllWithBandWidth from './utils/promiseAllWithBandWidth';
import IEmployee from '../interfaces/IEmployee';
import { EViewPriority } from '../google/interfaces/EPriority';

type Props = {
  specialization?: 'UI' | 'HR'
};

class PMO {
  specialization: string;

  jsessionid: string;

  rawUIEngineers: IGetAllActiveResponse;

  employees: IEmployee[];

  UIEngineers: IEmployee[];

  constructor({ specialization = 'UI' }: Props = {}) {
    this.specialization = specialization;
    this.jsessionid = undefined;
    this.rawUIEngineers = undefined;
    this.UIEngineers = undefined;
  }

  auth = async function () {
    this.jsessionid = await signIn();
  };

  getActiveUIEmployees = async function () {
    const rawEmployees = await getAllActive(this.jsessionid);
    this.employees = rawEmployees.map((employee: IGetAllActiveResponseItem): IEmployee => ({
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
    }));
  };

  getAccountType = async function () {
    console.log('get account types');
  };

  populate = async function (employees:IEmployee[], callback: () => void) {
    return promiseAllWithBandWidth(
      employees
        .map((employee: IEmployee): (() => Promise<IEmployee>) => async () => ({
          ...employee,
          priority: getPriority(
            await getEmployeeProjects(
              employee.username,
              this.jsessionid,
              callback,
            ),
          ),
        })),
    );
  };
}

export default PMO;
