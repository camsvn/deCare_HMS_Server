import {DataTypes, Sequelize, Model, BuildOptions} from 'sequelize';
import { IModelCollection } from '..';

export interface ITomogramMaster extends Model {
    readonly id: number;
    readonly opregisterid: number;
    readonly datetime: string;
    readonly narration: string;
    readonly doctorid: number;
    readonly no: number;
    readonly tomogramtypeid: number;
}

export type TomogramMasterStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ITomogramMaster;
}

export const TomogramMaster = (sequelize: Sequelize, db: IModelCollection) => (
    <TomogramMasterStatic>sequelize.define('tomogramMaster', {
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        OPRegisterID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        DateTime: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        Narration: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        DoctorID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        No: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        TomogramTypeID: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'TomogramMaster',
        timestamps: false,
        hooks: {
            beforeCreate: async (instance: Model<ITomogramMaster>) => {
                //check latest entry
                const tomMaster: number = await db.main.TomogramMaster?.max('no')
            }
        }
    })
);


