import { Model, ModelCtor } from 'sequelize'
import { User, IUserInstance, UserInstanceStatic } from './user/user.model';
import { TomogramType, ITomogramType, TomogramTypeStatic } from './main/tomogramType.model';
import { TomogramMaster, ITomogramMaster, TomogramMasterStatic } from './main/tomogramMaster.model';
import { TomogramDetail, ITomogramDetail, TomogramDetailStatic } from './main/tomogramDetail.model';
import { DatabaseTables } from '../helpers/constants'

export {ITomogramType, IUserInstance, ITomogramDetail, ITomogramMaster}

type UserModelCollection = {
    'UserModel': UserInstanceStatic    
}

type MainModelCollection = {
    'TomogramTypeModel': TomogramTypeStatic
    'TomogramDetail': TomogramDetailStatic
    'TomogramMaster': TomogramMasterStatic
}

export type IModelCollection = {
    'user' : UserModelCollection,
    'main' : MainModelCollection
}

export const modelCollection = {
    user: {
        UserModel: User
    },
    main: {
        TomogramTypeModel: TomogramType,
        TomogramDetail,
        TomogramMaster
    }
}
