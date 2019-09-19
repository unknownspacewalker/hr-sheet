import ora from 'ora';

import signIn from './pmo/api/auth/signIn';
import getAllActive from './pmo/api/employees/getAllActive';
import getEmployeeProjects from './pmo/api/employees/getEmployeeProjects';


(async () => {
  try {
    const PMOAuthSpinner = ora('Authorization in PMO').start();
    const jsessionid = await signIn();
    PMOAuthSpinner.succeed();

    const PMOGetEmployees = ora('Fetching PMO employee list').start();
    const allEmployees = await getAllActive(jsessionid);
    PMOGetEmployees.succeed();

    const UIRawEngeneers = allEmployees
      .filter((employee) => employee.latestGrade.specialization === 'UI');

    const PMOGetEmployeesProjects = ora(`Fetching employees' projects [0/${UIRawEngeneers.length}]`).start();
    let counter = 0;
    const incCounter = () => {
      counter += 1;
      PMOGetEmployeesProjects.text = `Fetching UI engineers' projects [${counter}/${UIRawEngeneers.length}]`;
    };
    const uiEngineers = await Promise.all(UIRawEngeneers
      .map(async (uiEngineer) => ({
        uiEngineer,
        projects: await getEmployeeProjects(uiEngineer.general.username, jsessionid, incCounter),
      })));
    PMOGetEmployeesProjects.succeed();

    console.log(uiEngineers.length);
  } catch (e) {
    console.log('error:', e.message);
  }
})();
