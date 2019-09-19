function isBenchAccount(accountName: string) {
  return accountName === 'Corporate Delivery Bench';
}
function isInternalAccount(accountName: string) {
  const internalAccounts = [
    'Tools',
    'TA Offshore',
    'TA Onsite',
    'Sales Management',
    'R&D General',
    'Pre-Sales',
    'Office',
    'Marketing',
    'Internship',
    'IT',
    'GridDynamics',
    'Engineering Management',
    'Corporate Delivery Bench',
    'Delivery Management',
    'GridU Trainings',
  ];

  return internalAccounts.includes(accountName);
}
// function isExternalAccount(accountName: string) {
//   return !isBenchAccount(accountName) && !isInternalAccount(accountName);
// }

function getPriority(projects: string[]): IEmployee['priority'] {
  let currentPriority: IEmployee['priority'] = '1. Bench';
  // projectFullName format: '<accountName>/<projectname>'
  projects.forEach((projectFullName: string) => {
    let accountPriority: IEmployee['priority'] = '3. Billable Project';
    const accountName = projectFullName.replace(/\/$/, '');

    if (isBenchAccount(accountName)) {
      accountPriority = '1. Bench';
    } else if (isInternalAccount(accountName)) {
      accountPriority = '2. Internal Project';
    }

    if (currentPriority < accountPriority) {
      currentPriority = accountPriority;
    }
  });
  return currentPriority;
}

export default getPriority;