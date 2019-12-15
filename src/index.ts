import ora from 'ora';

import * as dotenv from 'dotenv';
import PMO from './pmo';
import onboardingProcessorFactory from './google/onboardingProcessorFactory';
import GoogleWrapper from './google/GoogleWrapper';
import EmployeeInterface from './interfaces/EmployeeInterface';
import simpleProcessorFactory from './google/simpleProcessorFactory';
import hrProcessorFactory from './google/hrProcessorFactory';
import Skilltree from './skilltree';

// import Google from './google';

dotenv.config();

const {
  SHEET_ID,
  T4_PAGE_ID,
  T4_PAGE_NAME,
  ONBOARDING_PAGE_ID,
  ONBOARDING_PAGE_NAME,
  ONBOARDING_HR_PAGE_ID,
  ONBOARDING_HR_PAGE_NAME,
  HR_PAGE_ID,
  HR_PAGE_NAME,
} = process.env;

export const syncronizeSheet = async (): Promise<void> => {
  try {
    const pmo = new PMO();
    // const google = new Google();

    // init google instance
    const onboardingProcessor = onboardingProcessorFactory(
      new GoogleWrapper(
        SHEET_ID,
        Number(ONBOARDING_PAGE_ID),
        ONBOARDING_PAGE_NAME
      )
    );
    const t4Processor = simpleProcessorFactory(
      new GoogleWrapper(SHEET_ID, Number(T4_PAGE_ID), T4_PAGE_NAME)
    );
    const hrOnboardingProcessor = simpleProcessorFactory(
      new GoogleWrapper(
        SHEET_ID,
        Number(ONBOARDING_HR_PAGE_ID),
        ONBOARDING_HR_PAGE_NAME
      )
    );
    const hrProcessor = hrProcessorFactory(
      new GoogleWrapper(SHEET_ID, Number(HR_PAGE_ID), HR_PAGE_NAME)
    );

    const PMOAuthSpinner = ora('Authorization in PMO').start();
    try {
      await pmo.auth();
      PMOAuthSpinner.succeed();
    } catch (e) {
      PMOAuthSpinner.fail();
      throw e;
    }

    const PMOGetEmployeesSpinner = ora('Fetching PMO employee list').start();
    try {
      await pmo.getActiveUIEmployees();
      PMOGetEmployeesSpinner.succeed();
    } catch (e) {
      PMOGetEmployeesSpinner.fail();
      throw e;
    }

    const onboardingSheetSpinner = ora('Sync Onboarding page').start();
    try {
      await onboardingProcessor.sync(
        pmo.employees
          .filter(
            (employee: EmployeeInterface) =>
              (employee.specialization === 'UI' ||
                employee.specialization === 'Full stack') &&
              employee.track === 'T' &&
              employee.level >= 2
          )
          .filter(pmo.filterTrial)
      );
      onboardingSheetSpinner.succeed();
    } catch (e) {
      onboardingSheetSpinner.fail();
      throw e;
    }

    const t4SheetSpinner = ora('Sync T4 On Duty page').start();
    try {
      await t4Processor.sync(
        pmo.employees.filter(
          (employee: EmployeeInterface) =>
            (employee.specialization === 'UI' ||
              employee.specialization === 'Full stack') &&
            employee.level >= 4 &&
            employee.track === 'T'
        )
      );
      t4SheetSpinner.succeed();
    } catch (e) {
      t4SheetSpinner.fail();
      throw e;
    }

    const hrOnboardingSheetSpinner = ora('Sync HR Onboarding page').start();
    try {
      await hrOnboardingProcessor.sync(
        pmo.employees.filter(
          (employee: EmployeeInterface) => employee.track === 'H'
        )
      );
      hrOnboardingSheetSpinner.succeed();
    } catch (e) {
      hrOnboardingSheetSpinner.fail();
      throw e;
    }

    const onboardedEmployees = pmo.employees.filter(
      (employee: EmployeeInterface) =>
        onboardingProcessor.onboardedEmployees.includes(employee.id)
    );
    if (onboardedEmployees.length === 0) {
      return;
    }
    const PMOGetEmployeesProjectsSpinner = ora(
      `Fetching employees' projects [0/${onboardedEmployees.length}]`
    ).start();

    let hrEmployees = [];
    try {
      let counter = 0;
      const incrementCounter = (): void => {
        counter += 1;
        PMOGetEmployeesProjectsSpinner.text = `Fetching employees' projects [${counter}/${onboardedEmployees.length}]`;
      };

      hrEmployees = await pmo.populate(
        pmo.employees.filter((employee: EmployeeInterface) =>
          onboardingProcessor.onboardedEmployees.includes(employee.id)
        ),
        incrementCounter
      );
      // populate with skills
      PMOGetEmployeesProjectsSpinner.succeed();
    } catch (e) {
      PMOGetEmployeesProjectsSpinner.fail();
      throw e;
    }

    const skillsSpinner = ora('Populating with skills').start();

    try {
      const skillTree = new Skilltree();
      await skillTree.signIn();
      hrEmployees = await skillTree.populate(hrEmployees);
      // populate with skills
      skillsSpinner.succeed();
    } catch (e) {
      skillsSpinner.fail();
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
    console.error('error:', e.message);
    console.log('stack:', e.stack);
  }
};
