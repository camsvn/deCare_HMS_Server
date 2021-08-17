import { Application } from "express";

import Locals from '../providers/Locals';

import Http from './Http';
import StatusMonitor from './StatusMonitor';

class Kernal {
    public static init(_express: Application) : Application {

        _express = Http.mount(_express);

        _express = StatusMonitor.mount(_express);

        return _express;
    }
}

export default Kernal;