import { Sequelize } from 'sequelize';
import { Model, ModelCtor } from 'sequelize/types';

import Locals from './Locals';
import Log from '../middlewares/Log';
import modelsDefinition, {IModels} from '../models'

class Database {
    public static sequelize : Sequelize;
    public static models : {[key: string]: typeof Model} = {};

	constructor () {
        this.configure();
        this.loadModals();
    }

	private loadModals(): void {
		const modelNames = Object.keys(modelsDefinition);

		Log.info('Database :: Loading Database Models...')
		// console.log('Modals', modelsDefinition);		
		// console.log('Before: SequelizeModal', Database.sequelize.models);
		Object.values(modelsDefinition).map((model, index) => {
			const modelName = modelNames[index];
			Database.models[modelName] = model(Database.sequelize);
			Log.info(`Database :: ${modelName}Modal added`);
			// console.log(Database.models.User === Database.sequelize.models.user)
		})
		// console.log('After: SequelizeModal', Database.sequelize.models);
	}

	// Configure database pool
	private configure (): void {
		const { database } = Locals.config();
		
        Database.sequelize = new Sequelize(database.name , database.user, database.password, {
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
	}

	public init(): void {
		Database.sequelize.authenticate()
			.then(() => {Log.info('Database :: Connection Succesfull @ Master')})
			.catch((err: Error) => Log.error(`Database :: ${err.message} \n${err.stack}`));
	}
}

export default new Database();
export const connection = Database.sequelize
export const models: IModels = Database.models