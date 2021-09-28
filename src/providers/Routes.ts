import { Application } from "express";
import Log from '../middlewares/Log';

import Locals from './Locals';
import apiRouter from '../routes';

class Routes {
    public mountApi(_express: Application) : Application {
        const apiPrefix = Locals.config().apiPrefix;
        Log.info('Routes :: Mounting API Routes...');

        _express.use(`/${apiPrefix}`, apiRouter);

        return _express;
    }
}

export default new Routes;