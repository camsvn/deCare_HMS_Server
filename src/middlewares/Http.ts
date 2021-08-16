import { Application, json } from 'express';
import helmet from 'helmet';


import Log from './Log';
import Locals from '../providers/Locals';

class Http {
    public static mount(_express: Application): Application {
        Log.info('Booting the \'HTTP\' middleware...');

        _express.use(json({
            limit: Locals.config().maxUploadLimit
        }))

        
        /**
         * https://expressjs.com/en/advanced/best-practice-security.html
         * Security overheads
         */
        _express.use(helmet());

        return _express;
    }
}

export default Http;