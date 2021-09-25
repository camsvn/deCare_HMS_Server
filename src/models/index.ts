import { Model, ModelCtor } from 'sequelize'
import {User, IUserInstance} from './user.model'

interface IModel {
    [key: string]: Function
}

export type IModels = {
    'User'?: ModelCtor<Model>
}

export default {User}
