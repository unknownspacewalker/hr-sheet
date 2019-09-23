import ora from 'ora';

import PMO from './pmo';
import sheet from './sheet';

(async () => {
  try {
    const pmo = new PMO();

    const PMOAuthSpinner = ora('Authorization in PMO')
      .start();
    try {
      await pmo.auth();
      PMOAuthSpinner.succeed();
    } catch (e) {
      PMOAuthSpinner.fail();
      throw e;
    }

    const PMOGetEmployeesSpinner = ora('Fetching PMO employee list')
      .start();
    try {
      await pmo.getActiveUIEmployees();
      PMOGetEmployeesSpinner.succeed();
    } catch (e) {
      PMOGetEmployeesSpinner.fail();
      throw e;
    }

<<<<<<< HEAD
    const UIRawEngeneers = allEmployees
      .filter((employee) => employee.latestGrade.specialization === 'UI')
      .slice(0, 20);

    const PMOGetEmployeesProjectsSpinner = ora(
      `Fetching employees' projects [0/${UIRawEngeneers.length}]`,
=======
    const PMOGetEmployeesProjectsSpinner = ora(
      `Fetching employees' projects [0/${pmo.rawUIEngineers.length}]`,
>>>>>>> 3b22d2e1a55fd429cba350ee7ac3692282c76174
    )
      .start();
    try {
      let counter = 0;
      const incrementCounter = () => {
        counter += 1;
        PMOGetEmployeesProjectsSpinner.text = (
          `Fetching employees' projects [${counter}/${pmo.rawUIEngineers.length}]`
        );
      };
      await pmo.getUIEngineers(incrementCounter);
      PMOGetEmployeesProjectsSpinner.succeed();

      const GoogleSheetSpinner = ora('Writing to Google Sheet').start();
      await sheet(pmo.UIEngineers);
      GoogleSheetSpinner.succeed();
    } catch (e) {
      PMOGetEmployeesProjectsSpinner.fail();
      throw e;
    }

    console.log('success:', pmo.UIEngineers);
  } catch (e) {
    console.log('error:', e.message);
    console.log('stack:', e.stack);
  }
})();
