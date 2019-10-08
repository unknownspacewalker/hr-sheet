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

    const onboardingSheetSpinner = ora('Sync Onboarding page')
      .start();
    try {
      await onboardingProcessor.sync(
        pmo.employees.filter(
          (employee: IEmployee) => (
            employee.specialization === 'UI' && employee.track === 'T' && employee.level >= 2
          ),
        ),
      );
      onboardingSheetSpinner.succeed();
    } catch (e) {
      onboardingSheetSpinner.fail();
      throw e;
    }

    const t4SheetSpinner = ora('Sync T4 On Duty page')
      .start();
    try {
      await t4Processor.sync(
        pmo.employees.filter(
          (employee: IEmployee) => (
            employee.specialization === 'UI' && employee.level === 4 && employee.track === 'T'
          ),
        ),
      );
      t4SheetSpinner.succeed();
    } catch (e) {
      t4SheetSpinner.fail();
      throw e;
    }

    const hrOnboardingSheetSpinner = ora('Sync HR Onboarding page')
      .start();
    try {
      await hrOnboardingProcessor.sync(
        pmo.employees.filter(
          (employee: IEmployee) => employee.track === 'H',
        ),
      );
      hrOnboardingSheetSpinner.succeed();
    } catch (e) {
      hrOnboardingSheetSpinner.fail();
      throw e;
    }

    const onboardedEmployees = pmo.employees.filter((employee: IEmployee) => (
      onboardingProcessor.onboardedEmployees.includes(employee.id)
    ));

    const PMOGetEmployeesProjectsSpinner = ora(
      `Fetching employees' projects [0/${onboardedEmployees.length}]`,
    )
      .start();

    let hrEmployees = [];
    try {
      let counter = 0;
      const incrementCounter = () => {
        counter += 1;
        PMOGetEmployeesProjectsSpinner.text = (
          `Fetching employees' projects [${counter}/${onboardedEmployees.length}]`
        );
      };

      hrEmployees = await pmo.populate(
        pmo.employees.filter(
          (employee: IEmployee) => (
            onboardingProcessor.onboardedEmployees.includes(employee.id)
          ),
        ),
        incrementCounter,
      );
      PMOGetEmployeesProjectsSpinner.succeed();
    } catch (e) {
      PMOGetEmployeesProjectsSpinner.fail();
      throw e;
    }

    const hrSheetSpinner = ora('Sync HR page').start();
    try {
      await hrProcessor.sync(hrEmployees);
      hrSheetSpinner.succeed();
    } catch (e) {
      hrSheetSpinner.fail();
      throw e;
    }
  } catch (e) {
    console.log('error:', e.message);
    console.log('stack:', e.stack);
  }
})();
