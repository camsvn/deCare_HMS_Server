import { Model, ModelCtor } from 'sequelize'
import {User} from './user.model';

export interface IUserInstance extends Model {
    id: number;
    username: string;
    password: string;
    clientId: number;
    financialYearId: number;
    parentUserId: number;
    companyId: number;
    reportDays: number;
}

interface IModel {
    [key: string]: Function
}

export type IModels = {
    'User'?: ModelCtor<Model>
}

export default {User}
