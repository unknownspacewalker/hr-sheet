import ora from "ora";

import signIn from "./pmo/api/auth/signIn";
import getAllActive from "./pmo/api/employees/getAllActive";
import getEmployeeProjects from "./pmo/api/employees/getEmployeeProjects";
import getPriority from "./pmo/utils/getPriority";

import sheet from "./sheet";
import IEmployee from "./interfaces/IEmployee";

(async () => {
  try {
    const PMOAuthSpinner = ora("Authorization in PMO").start();
    let jsessionid: string;
    try {
      jsessionid = await signIn();
      PMOAuthSpinner.succeed();
    } catch (e) {
      PMOAuthSpinner.fail();
      throw e;
    }

    const PMOGetEmployeesSpinner = ora("Fetching PMO employee list").start();
    let allEmployees = [];
    try {
      allEmployees = await getAllActive(jsessionid);
      PMOGetEmployeesSpinner.succeed();
    } catch (e) {
      PMOGetEmployeesSpinner.fail();
      throw e;
    }

    const UIRawEngeneers = allEmployees
      .filter(employee => employee.latestGrade.specialization === "UI")
      .slice(0, 10);

    const PMOGetEmployeesProjectsSpinner = ora(
      `Fetching employees' projects [0/${UIRawEngeneers.length}]`
    ).start();
    let uiEngineers: IEmployee[] = [];
    try {
      let counter = 0;
      const incCounter = () => {
        counter += 1;
        PMOGetEmployeesProjectsSpinner.text = `Fetching UI engineers' projects [${counter}/${UIRawEngeneers.length}]`;
      };
      uiEngineers = await Promise.all(
        UIRawEngeneers.map(
          async (employee: IGetAllActiveResponseItem): Promise<IEmployee> => ({
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
                jsessionid,
                incCounter
              )
            )
          })
        )
      );

      PMOGetEmployeesProjectsSpinner.succeed();

      await sheet(uiEngineers);
    } catch (e) {
      PMOGetEmployeesProjectsSpinner.fail();
      throw e;
    }

    console.log("success:", uiEngineers);
  } catch (e) {
    console.log("error:", e.message);
    console.log("stack:", e.stack);
  }
})();
