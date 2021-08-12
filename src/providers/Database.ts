import { Sequelize } from 'sequelize';


import Locals from './Locals';
import Log from '../middlewares/Log';

export class Database {
    public static sequelize : Sequelize;
	// Initialize your database pool
	public static init (): any {
		// const dsn = Locals.config().mongooseUrl;
		// const options = { useNewUrlParser: true, useUnifiedTopology: true };

		// (<any>mongoose).Promise = bluebird;

		// mongoose.set('useCreateIndex', true);

		// mongoose.connect(dsn, options, (error: MongoError) => {
		// 	// handle the error case
		// 	if (error) {
		// 		Log.info('Failed to connect to the Mongo server!!');
		// 		console.log(error);
		// 		throw error;
		// 	} else {
		// 		Log.info('connected to mongo server at: ' + dsn);
		// 	}
		// });
        this.sequelize = new Sequelize('sqlite::memory:');

	}
}

export default Database.sequelize;