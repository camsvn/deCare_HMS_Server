import { Model, ModelCtor } from 'sequelize'
import { User, IUserInstance } from './user/user.model';
import { TomogramType, ITomogramInstance } from './main/tomogramType.model';
import { DatabaseTables } from '../helpers/constants'

export {ITomogramInstance, IUserInstance}

type UserModelCollection = {
    'UserModel'?: ModelCtor<Model>    
}

type MainModelCollection = {
    'TomogramTypeModel'?: ModelCtor<Model>    
}

export type IModelCollection = {
    'user' : UserModelCollection,
    'main' : MainModelCollection
}

export const modelCollection = {
    [DatabaseTables.DB_USER]: {
        UserModel: User
    },
    [DatabaseTables.DB_MAIN]: {
        TomogramTypeModel: TomogramType
    }
}
