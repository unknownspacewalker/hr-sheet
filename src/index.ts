import signIn from './pmo/api/auth/signIn';
import getAllActive from './pmo/api/employees/getAllActive';
import getEmployeeProjects from './pmo/api/employees/getEmployeeProjects';
import { checkEmployeeLevel, checkEmployeeSpecialization } from './pmo/utils';

(async () => {
  try {
    const jsessionid = await signIn();
    const allEmployees = await getAllActive(jsessionid);
    const uiEngineers = await Promise.all(allEmployees
      .filter(checkEmployeeSpecialization)
      .filter(checkEmployeeLevel)
      .map(async (uiEngineer) => ({
        ...uiEngineer,
        projects: await getEmployeeProjects(uiEngineer.general.username, jsessionid),
      })));

    console.log(uiEngineers);
  } catch (e) {
    console.log('error:', e.message);
  }
})();
