import { Application } from 'express';
import * as path from 'path';
import * as dotenv from 'dotenv';

class Locals {
    public static config(): any {
        dotenv.config({ path: path.join(__dirname, '../../.env') });

		const url = process.env.APP_URL || `http://localhost:${process.env.PORT}`;
		const port = process.env.PORT || 4040;
		const appSecret = process.env.APP_SECRET || 'This is your responsibility!';
		// const mongooseUrl = process.env.MONGOOSE_URL;
		const maxUploadLimit = process.env.APP_MAX_UPLOAD_LIMIT || '50mb';
		// const maxParameterLimit = process.env.APP_MAX_PARAMETER_LIMIT || '50mb';

        const name = process.env.APP_NAME || 'DeCare HMS';
		const year = (new Date()).getFullYear();
		const copyright = `Copyright ${year} ${name} | All Rights Reserved`;
		const company = process.env.COMPANY_NAME || 'DeCare Software Solutions';
		const description = process.env.APP_DESCRIPTION || 'Here goes the app description';

        const logDays = process.env.LOG_DAYS || 10;

        const isCORSEnabled =  process.env.CORS_ENABLED || true;

        const apiPrefix = process.env.API_PREFIX || 'api';

        const databaseHost = process.env.SQL_SERVER;
        const databaseName = process.env.SQL_DATABASE;
        const databaseInstance = process.env.SQL_SERVER_INSTANCE;
        const databaseUser = process.env.SQL_USER;
        const databasePassword = process.env.SQL_PASSWORD;



        return {
            url,
            port,
            appSecret,
            maxUploadLimit,
            name,
            copyright,
            company,
            description,
            logDays,
            isCORSEnabled,
            apiPrefix,
            database : {
                host: databaseHost,
                name: databaseName,
                instanceName: databaseInstance,
                user: databaseUser,
                password: databasePassword
            }
        }
    }

    public static init (_express: Application): Application {
        _express.locals.app = this.config();
        return _express;
    }
}

export default Locals;
