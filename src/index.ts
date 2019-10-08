import ora from 'ora';

import dotenv from 'dotenv';
import PMO from './pmo';
import hrProcessorFactory from './google/hrProcessorFactory';
import GoogleWrapper from './google/GoogleWrapper';
import IEmployee from './interfaces/IEmployee';
import { EViewPriority } from './google/interfaces/EPriority';

// import Google from './google';

dotenv.config();

const { SHEET_ID, PAGE_ID, PAGE_NAME } = process.env;

(async () => {
  try {
    const pmo = new PMO();
    // const google = new Google();

    // init google instance
    const onboardingProcessor = hrProcessorFactory(
      new GoogleWrapper(SHEET_ID, +PAGE_ID, PAGE_NAME),
    );

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

    // sync google raw employees
    await onboardingProcessor.sync(pmo.rawUIEngineers
      .map((employee: IGetAllActiveResponseItem): IEmployee => ({
        id: employee.id,
        manager: employee.jobInfo.managerId,
        username: employee.general.username,
        firstName: employee.general.firstName,
        familyName: employee.general.familyName,
        track: employee.latestGrade.track,
        level: employee.latestGrade.level,
        location: employee.latestGrade.location,
        priority: EViewPriority.Bench,
      })));

    // console.dir(onboardingProcessor.onboardedEmployees);

    // const PMOGetEmployeesProjectsSpinner = ora(
    //   `Fetching employees' projects [0/${pmo.rawUIEngineers.length}]`,
    // )
    //   .start();
    // try {
    //   let counter = 0;
    //   const incrementCounter = () => {
    //     counter += 1;
    //     PMOGetEmployeesProjectsSpinner.text = (
    //       `Fetching employees' projects [${counter}/${pmo.rawUIEngineers.length}]`
    //     );
    //   };
    //   await pmo.getUIEngineers(incrementCounter);
    //   PMOGetEmployeesProjectsSpinner.succeed();

    //   const GoogleSheetSpinner = ora('Writing to Google Sheet').start();
    //   await google.sync(pmo.UIEngineers);
    //   GoogleSheetSpinner.succeed();
    // } catch (e) {
    //   PMOGetEmployeesProjectsSpinner.fail();
    //   throw e;
    // }
  } catch (e) {
    console.log('error:', e.message);
    console.log('stack:', e.stack);
  }
})();
