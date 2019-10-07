import signIn from './api/auth/signIn';
import getAllActive from './api/employees/getAllActive';
import getEmployeeProjects from './api/employees/getEmployeeProjects';
import getPriority from './utils/getPriority';
import promiseAllWithBandWidth from './utils/promiseAllWithBandWidth';
import IEmployee from '../interfaces/IEmployee';

type Props = {
  specialization?: 'UI' | 'HR'
};

class PMO {
  specialization: string;

  jsessionid: string;

  rawUIEngineers: IGetAllActiveResponse;

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
    this.rawUIEngineers = rawEmployees
      .filter((employee) => employee.latestGrade.specialization === this.specialization)
      .slice(0, 25);
  };

  getAccountType = async function () {
    console.log('get account types');
  };

  getUIEngineers = async function (callback: () => void) {
    this.UIEngineers = await promiseAllWithBandWidth(
      this.rawUIEngineers
        .map((employee: IGetAllActiveResponseItem): (() => Promise<IEmployee>) => async () => ({
          id: employee.id,
          manager: employee.jobInfo.managerId,
          username: employee.general.username,
          firstName: employee.general.firstName,
          familyName: employee.general.familyName,
          track: employee.latestGrade.track,
          level: employee.latestGrade.level,
          location: employee.latestGrade.location,
          priority: getPriority(
            await getEmployeeProjects(
              employee.general.username,
              this.jsessionid,
              callback,
            ),
          ),
        })),
    );
  };
}

export default PMO;
