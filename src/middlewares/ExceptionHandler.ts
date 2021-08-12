import { ErrorRequestHandler, Application, Request, Response } from 'express';

import Log from './Log';
import Locals from '../providers/Locals';

class Handler {
    public static notFoundHandler(_express: Application): Application {
        const apiPrefix = Locals.config().apiPrefix;

        _express.use('*', (req: Request, res: Response) => {
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

            Log.error(`Path '${req.originalUrl}' not found [IP: '${ip}']!`);

            if(req.xhr || req.originalUrl.includes(`/${apiPrefix}`)) {
                return res.json({
                    error: 'Page not found'
                })
            }
        })

        return _express;
    }

    public static logError: ErrorRequestHandler = (err, req, res, next) => {
        Log.error(err.stack);

        return next(err);
    }
}

export default Handler;