import 'source-map-support/register';
import { syncronizeSheet } from './src';

export const sync = async (): Promise<void> => {
  await syncronizeSheet();
};
