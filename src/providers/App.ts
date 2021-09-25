import * as path from 'path';
import * as dotenv from 'dotenv';

import Express from './Express';
import Database from './Database';

import Log from '../middlewares/Log';

class App {
    // Load dotenv file
    public loadConfiguartion (): void {
        Log.info('Configuration :: Booting @ Master...');
        dotenv.config({path: path.join(__dirname, '../../.env')});
    }

    // Load Server
    public loadServer (): void {
        Log.info('Server :: Booting @ Master...');
        Express.init();
    }

    public loadDatabase (): void {
		Log.info('Database :: Booting @ Master...');

		Database.init();
	}
}

export default new App;