import { Application } from 'express';
import * as path from 'path';
import * as dotenv from 'dotenv';
import {DatabaseTables} from '../helpers/constants'
class Locals {
    public static config() {
        const rootDir = process.cwd();
        dotenv.config({ path: path.join(rootDir, '.env') });
        // dotenv.config({ path: path.join(__dirname, '../../.env') });
        const appRoot = path.join(__dirname, '../../')
		const url = process.env.APP_URL || `http://localhost:${process.env.PORT}`;
		const port = process.env.PORT || '4040';
		const appSecret = process.env.APP_SECRET || 'This is your responsibility!';
		// const mongooseUrl = process.env.MONGOOSE_URL;
		const maxUploadLimit = process.env.APP_MAX_UPLOAD_LIMIT || '50mb';
		// const maxParameterLimit = process.env.APP_MAX_PARAMETER_LIMIT || '50mb';

        const name = process.env.APP_NAME || 'DeCare HMS';
		const year = (new Date()).getFullYear();
		const copyright = `Copyright ${year} ${name} | All Rights Reserved`;
		const company = process.env.COMPANY_NAME || 'DeCare Software Solutions';
		const description = process.env.APP_DESCRIPTION || 'Here goes the app description';

        const logDays = isNaN(Number(process.env.LOG_DAYS)) ? 10 : Number(process.env.LOG_DAYS);

        const apiPrefix = process.env.API_PREFIX || 'api';

        const databaseHost = process.env.SQL_SERVER || '';
        const databaseNames: Record<string,string> = {
            [DatabaseTables.DB_USER]: process.env.SQL_DATABASE || '',
            [DatabaseTables.DB_MAIN]: process.env.MAIN_DATABASE || ''
        };
        const databaseInstance = process.env.SQL_SERVER_INSTANCE || '';
        const databaseUser = process.env.SQL_USER || '';
        const databasePassword = process.env.SQL_PASSWORD || '';

        const jwtExpiresIn = process.env.JWT_EXPIRES_IN || 3;

        return {
            rootDir,
            appRoot,
            url,
            port,
            appSecret,
            maxUploadLimit,
            name,
            copyright,
            company,
            description,
            logDays,
            apiPrefix,
            database : {
                host: databaseHost,
                names: databaseNames,
                instanceName: databaseInstance,
                username: databaseUser,
                password: databasePassword
            },
            jwtExpiresIn
        }
    }

    public static init (_express: Application): Application {
        _express.locals.app = this.config();
        return _express;
    }
}

export default Locals;
