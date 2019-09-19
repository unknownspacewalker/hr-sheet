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
function isExternalAccount(accountName: string) {
  return !isBenchAccount(accountName) && !isInternalAccount(accountName);
}

export { isBenchAccount, isExternalAccount, isInternalAccount };
