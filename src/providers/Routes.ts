import { Application } from "express";
import Log from '../middlewares/Log';

import Locals from './Locals';
import {apiRouter, authRouter} from '../routes';

import {verifyToken as auth} from '../middlewares/auth';

class Routes {
    public mountApi(_express: Application) : Application {
        const apiPrefix = Locals.config().apiPrefix;
        Log.info('Routes :: Mounting API Routes...');

        _express.use(`/${apiPrefix}/auth`, authRouter);
        _express.use(`/${apiPrefix}`, auth, apiRouter);

        return _express;
    }
}

export default new Routes;