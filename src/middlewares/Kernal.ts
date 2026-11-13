import { Application } from "express";

import Locals from '../providers/Locals';

import Http from './Http';

class Kernal {
    public static init(_express: Application) : Application {

        _express = Http.mount(_express);

        return _express;
    }
}

export default Kernal;