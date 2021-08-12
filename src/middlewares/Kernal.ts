import { Application } from "express";

import Locals from '../providers/Locals';

import CORS from './CORS';
import Http from './Http';
import StatusMonitor from './StatusMonitor';

class Kernal {
    public static init(_express: Application) : Application {
        if (Locals.config().isCORSEnabled) {
            _express = CORS.mount(_express);
        }

        _express = Http.mount(_express);

        _express = StatusMonitor.mount(_express);

        return _express;
    }
}

export default Kernal;