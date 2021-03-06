import express from 'express';

import Locals from './Locals';
import Routes from './Routes';
import ExceptionHandler from '../exception/ExceptionHandler';
import Kernal from '../middlewares/Kernal';


class Express {
    public express: express.Application;

    constructor () {
        this.express = express();
        this.mountDotEnv();
        this.mountMiddlewares();
        this.mountRoutes();
    }

    private mountDotEnv() : void {
        this.express = Locals.init(this.express);
    }

    private mountMiddlewares() : void {
        this.express = Kernal.init(this.express);
    }

    private mountRoutes() : void {
        this.express = Routes.mountApi(this.express);
    }

    public init() : void {
        const port = Locals.config().port;

        this.express.use(ExceptionHandler.logError);
        this.express = ExceptionHandler.notFoundHandler(this.express);

        this.express.listen(port, () => {
            return console.log('\x1b[32m%s\x1b[0m', `Server :: Running @ 'http://localhost:${port}'`);
        })
    }

}

export default new Express();