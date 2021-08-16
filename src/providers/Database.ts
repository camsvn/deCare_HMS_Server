import { Sequelize } from 'sequelize';


import Locals from './Locals';
import Log from '../middlewares/Log';

export class Database {
    public static sequelize : Sequelize;
	// Initialize your database pool
	public static init (): any {
		const { database } = Locals.config();
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
        // this.sequelize = new Sequelize('sqlite::memory:');
		database.name , database.user, database.password, {
			dialect: "mssql",
			host: database.host,
			// logging: (...msg) => console.log(`${msg[1].type} Operation`),
			logging: false,
			define: {
			  freezeTableName: true,
			},
			dialectOptions: {
			  options: {
				instanceName: database.instanceName,
				encrypt: false, //false for server >v12
				trustServerCertificate: true,
				requestTimeout: 60000,
			  },
			},
			pool: {
			  max: 5,
			  idle: 3000,
			},
		  }

	}
}

export default Database.sequelize;