import path from 'path';
import { fromFile } from './clientFactory';

export default fromFile(path.resolve(process.cwd(), 'google-key.json'));
