import { fromToken } from './clientFactory';

const { GOOGLE_KEY } = process.env;

export default fromToken(GOOGLE_KEY);
