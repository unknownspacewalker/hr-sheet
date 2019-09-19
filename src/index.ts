import ora from 'ora';

import signIn from './pmo/api/auth/signIn';
import getAllActive from './pmo/api/employees/getAllActive';
import getEmployeeProjects from './pmo/api/employees/getEmployeeProjects';


(async () => {
  try {
    const PMOAuthSpinner = ora('Authorization in PMO').start();
    let jsessionid: string;
    try {
      jsessionid = await signIn();
      PMOAuthSpinner.succeed();
    } catch (e) {
      PMOAuthSpinner.fail();
      throw (e);
    }

    const PMOGetEmployeesSpinner = ora('Fetching PMO employee list').start();
    let allEmployees = [];
    try {
      allEmployees = await getAllActive(jsessionid);
      PMOGetEmployeesSpinner.succeed();
    } catch (e) {
      PMOGetEmployeesSpinner.fail();
      throw (e);
    }

    const UIRawEngeneers = allEmployees
      .filter((employee) => employee.latestGrade.specialization === 'UI');

    const PMOGetEmployeesProjectsSpinner = ora(`Fetching employees' projects [0/${UIRawEngeneers.length}]`).start();
    let uiEngineers = [];
    try {
      let counter = 0;
      const incCounter = () => {
        counter += 1;
        PMOGetEmployeesProjectsSpinner.text = `Fetching UI engineers' projects [${counter}/${UIRawEngeneers.length}]`;
      };
      uiEngineers = await Promise.all(UIRawEngeneers
        .map(async (uiEngineer) => ({
          uiEngineer,
          projects: await getEmployeeProjects(uiEngineer.general.username, jsessionid, incCounter),
        })));
      PMOGetEmployeesProjectsSpinner.succeed();
    } catch (e) {
      PMOGetEmployeesProjectsSpinner.fail();
      throw (e);
    }

    console.log(`Loaded ${uiEngineers.length} engineers`);
  } catch (e) {
    console.log('error:', e.message);
  }
})();
