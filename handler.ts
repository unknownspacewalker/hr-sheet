import 'source-map-support/register';
import { syncronizeSheet } from './src';

export const sync = async () => {
  await syncronizeSheet();
};
