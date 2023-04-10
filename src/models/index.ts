import { Model, ModelCtor } from 'sequelize'
import { User, IUserInstance, UserInstanceStatic } from './user/user.model';
import { TomogramType, ITomogramType, TomogramTypeStatic } from './main/tomogramType.model';
import { TomogramMasters, ITomogramMaster, TomogramMasterStatic } from './main/tomogramMaster.model';
import { TomogramDetails, ITomogramDetail, TomogramDetailStatic } from './main/tomogramDetail.model';
import { OpRegisters, IOpRegister, OpRegisterStatic } from './main/opRegister.model';
import { Settings, ISettings, SettingsStatic } from './main/settings.model';
import { DatabaseTables } from '../helpers/constants'

export {ITomogramType, IUserInstance, ITomogramDetail, ITomogramMaster}

type UserModelCollection = {
    'UserModel': UserInstanceStatic    
}

type MainModelCollection = {
    'TomogramTypeModel': TomogramTypeStatic
    'TomogramDetails': TomogramDetailStatic
    'TomogramMasters': TomogramMasterStatic
    'OpRegisters': OpRegisterStatic
    'Settings': SettingsStatic
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
        TomogramDetails,
        TomogramMasters,
        OpRegisters,
        Settings
    }
}
