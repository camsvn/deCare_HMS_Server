import {JwtPayload} from 'jsonwebtoken';

export interface IRequest {
    user: string | JwtPayload;
}
