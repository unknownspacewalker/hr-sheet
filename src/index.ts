import signIn from './pmo/api/auth/signIn';
import getAllActive from './pmo/api/employees/getAllActive';
import getEmployeeProjects from './pmo/api/employees/getEmployeeProjects';

(async () => {
  try {
    const jsessionid = await signIn();
    const allEmployees = await getAllActive(jsessionid);
    const uiEngineers = await Promise.all(allEmployees
      .filter((employee) => employee.latestGrade.specialization === 'UI')
      .map(async (uiEngineer) => ({
        ...uiEngineer,
        projects: await getEmployeeProjects(uiEngineer.general.username, jsessionid),
      })));

    console.log(uiEngineers);
  } catch (e) {
    console.log('error:', e.message);
  }
})();
