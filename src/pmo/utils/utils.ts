function isBenchAccount(accountName: string) {
  return accountName === 'Corporate Delivery Bench';
}
function isInternalAccount(accountName: string) {
  const internalAccounts = [
    'Marketing',
    'Tools',
    'R&D General',
    'GridU Trainings',
  ];

  return internalAccounts.includes(accountName);
}
function isExternalAccount(accountName: string) {
  return !isBenchAccount(accountName) && !isInternalAccount(accountName);
}

export { isBenchAccount, isExternalAccount, isInternalAccount };
