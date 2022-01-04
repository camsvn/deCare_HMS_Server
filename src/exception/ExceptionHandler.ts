import { ErrorRequestHandler, Application, Request, Response } from 'express';
 import path from 'path';
 import { errorResponse } from '../helpers/JSend';

import Log from '../middlewares/Log';
import Locals from '../providers/Locals';

class Handler {
    public static notFoundHandler(_express: Application): Application {
        const apiPrefix = Locals.config().apiPrefix;

        _express.use('*', (req: Request, res: Response) => {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            Log.error(`Path '${req.originalUrl}' not found [IP: '${ip}']!`);

            if(req.xhr || req.originalUrl.indexOf(`/${apiPrefix}`) === 0) {
                return res.status(404).json(errorResponse("Path not found"))
            } else {
                let requestType = req.accepts(['html', 'json'])
                if(requestType === 'html')
                    return res.status(404).sendFile(path.join(Locals.config().appRoot, '/views/404.html'))                
                return res.status(404).json(errorResponse("Page not found"))
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