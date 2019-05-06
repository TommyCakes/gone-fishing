import { showMessage } from './messenger';
import path from 'path';

showMessage(`Woo from another file: ${path.resolve(__dirname, 'src')}`);
