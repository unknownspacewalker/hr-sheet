import ora from 'ora';

import dotenv from 'dotenv';
import PMO from './pmo';
import onboardingProcessorFactory from './google/onboardingProcessorFactory';
import GoogleWrapper from './google/GoogleWrapper';
import IEmployee from './interfaces/IEmployee';
import simpleProcessorFactory from './google/simpleProcessorFactory';
import hrProcessorFactory from './google/hrProcessorFactory';

// import Google from './google';

dotenv.config();

const { SHEET_ID, PAGE_ID, PAGE_NAME } = process.env;

(async () => {
  try {
    const pmo = new PMO();
    // const google = new Google();

    // init google instance
    const onboardingProcessor = onboardingProcessorFactory(
      new GoogleWrapper(SHEET_ID, 1542451477, 'Onboarding'),
    );
    const t4Processor = simpleProcessorFactory(
      new GoogleWrapper(SHEET_ID, 1382120156, 'T4 On Duty'),
    );
    const hrOnboardingProcessor = simpleProcessorFactory(
      new GoogleWrapper(SHEET_ID, 1139652961, 'Onboarding HR'),
    );
    const hrProcessor = hrProcessorFactory(
      new GoogleWrapper(SHEET_ID, 1147830334, 'HR'),
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
    await onboardingProcessor.sync(
      pmo.employees.filter(
        (employee: IEmployee) => (
          employee.specialization === 'UI' && employee.track === 'T' && employee.level >= 2
        ),
      ),
    );
    await t4Processor.sync(
      pmo.employees.filter(
        (employee: IEmployee) => (
          employee.specialization === 'UI' && employee.level === 4 && employee.track === 'T'
        ),
      ),
    );
    await hrOnboardingProcessor.sync(
      pmo.employees.filter(
        (employee: IEmployee) => employee.track === 'H',
      ),
    );

    const onboardedEmployees = pmo.employees.filter((employee: IEmployee) => (
      onboardingProcessor.onboardedEmployees.includes(employee.id)
    ));

    const PMOGetEmployeesProjectsSpinner = ora(
      `Fetching employees' projects [0/${onboardedEmployees.length}]`,
    )
      .start();
    try {
      let counter = 0;
      const incrementCounter = () => {
        counter += 1;
        PMOGetEmployeesProjectsSpinner.text = (
          `Fetching employees' projects [${counter}/${onboardedEmployees.length}]`
        );
      };
      await hrProcessor.sync(
        await pmo.populate(
          pmo.employees.filter(
            (employee: IEmployee) => (
              onboardingProcessor.onboardedEmployees.includes(employee.id)
            ),
          ),
          incrementCounter,
        ),
      );
      // await pmo.getUIEngineers(incrementCounter);
      PMOGetEmployeesProjectsSpinner.succeed();

      const GoogleSheetSpinner = ora('Writing to Google Sheet').start();
      // await google.sync(pmo.UIEngineers);
      GoogleSheetSpinner.succeed();
    } catch (e) {
      PMOGetEmployeesProjectsSpinner.fail();
      throw e;
    }
  } catch (e) {
    console.log('error:', e.message);
    console.log('stack:', e.stack);
  }
})();
