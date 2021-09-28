import {IRequest} from './IRequest'

declare module 'express-serve-static-core' {
    interface Request extends IRequest {}
}