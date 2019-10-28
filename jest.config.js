module.exports = {
  'preset': 'ts-jest',
  'testEnvironment': 'node',
  'moduleFileExtensions': ['ts', 'tsx', 'js'],
  'globals': { 'ts-jest': { 'tsConfig': 'tsconfig.json' } },
  'transform': { '^.+\\.(ts|tsx)$': 'ts-jest' },
  'testMatch': ['**/specs/*.+(ts|tsx|js)'],
};
