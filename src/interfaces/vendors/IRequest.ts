import {JwtPayload} from 'jsonwebtoken';

export interface IRequest {
    user: string;
    user_id?: number;
}

export interface IUserJWT extends JwtPayload {
    username: string;
    user_id: number;
}
