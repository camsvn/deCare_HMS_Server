import { Sequelize } from 'sequelize';


import Locals from './Locals';
import Log from '../middlewares/Log';

export class Database {
    public static sequelize : Sequelize;
	// Initialize your database pool
	public static init (): any {
		const { database } = Locals.config();
		
        this.sequelize = new Sequelize(database.name , database.user, database.password, {
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
		);

		this.sequelize.authenticate()
			.then(() => {Log.info('Database :: Connection Succesfull @ Master')})
			.catch((err: Error) => Log.error(`Database :: ${err.message} \n${err.stack}`))
	}
}

export default Database.sequelize;