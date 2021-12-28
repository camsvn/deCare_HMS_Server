import { Sequelize } from 'sequelize';

import Locals from './Locals';
import Log from '../middlewares/Log';
import {IModelCollection, modelCollection} from '../models';

type ValueOf<T> = T[keyof T];
type modelNameType = Array<keyof typeof modelCollection.main> | Array<keyof typeof modelCollection.user>;
type modelType = ValueOf<typeof modelCollection.main> | ValueOf<typeof modelCollection.user>;

class Database {
    public static connections : Map<string, Sequelize> = new Map();
    public static modelsCollection : any = {};

	constructor () {
        this.configure();
        this.loadModals();
    }

	private loadModals(): void {
		const databaseNames = Object.keys(modelCollection) as Array<keyof typeof modelCollection>;
		Log.info('Database :: Loading Database Models...');
		databaseNames.map((dbName) => {
			const modelDefinitions: any = modelCollection[dbName];
			const modelNames = Object.keys(modelDefinitions) as modelNameType ;
			let models: any = {}
			modelNames.forEach(modelName => {
				const model = modelDefinitions[modelName]	as modelType;
				models[modelName] = model(Database.connections.get(dbName)! , Database.modelsCollection);
				Log.info(`Database :: ${modelName} added`);
			});
			// Object.values(modelDefinitions).map((model,index) => {
			// 	const modelName = modelNames[index];
			// 	models[modelName] = model(Database.connections.get(dbName), Database.modelsCollection);
			// 	Log.info(`Database :: ${modelName} added`);
			// })
			Database.modelsCollection[dbName] = models;
		})
	}

	private getConnection(dbName: string, username: string, password: string, host:string, instanceName: string): Sequelize {
		return new Sequelize(dbName , username, password, {
			dialect: "mssql",
			host: host,
			// logging: (...msg) => console.log(`${msg[1].type} Operation`),
			logging: false,
			define: {
			  freezeTableName: true,
			},
			query: {
				raw: true,
			},
			dialectOptions: {
			  options: {
				instanceName: instanceName,
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
		) 
	}

	// Configure database pool
	private configure (): void {
		const { names, username, password, host, instanceName } = Locals.config().database;

		Object.keys(names).map((dbName) => {
			if(dbName != '') {
				const sequelize = this.getConnection(names[dbName], username, password, host, instanceName);
				Database.connections.set(dbName, sequelize);
			}
		});
	}

	public init(): void {
		Database.connections.forEach((connection, dbName) => {
			connection.authenticate()
				.then(() => {Log.info(`Database :: '${dbName}' Connection Succesfull @ Master`)})
				.catch((err: Error) => Log.error(`Database :: ${err.message} \n${err.stack}`));
		});
	}
}

export default new Database();
export const modelsCollection: IModelCollection = Database.modelsCollection;
export const mainDB = modelsCollection.main;
export const userDB = modelsCollection.user;
export const connections = Database.connections;