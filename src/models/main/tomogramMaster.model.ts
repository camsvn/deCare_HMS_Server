import {DataTypes, Sequelize, Model, BuildOptions} from 'sequelize';
import { IModelCollection } from '..';

export interface ITomogramMaster extends Model {
    readonly id: number;
    readonly opid: number;
    readonly date: string;
    readonly narration: string;
    readonly doctorId: number;
    readonly formNo: number;
    readonly tomogramTypeId: number;
}

export type TomogramMasterStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ITomogramMaster;
}

export const TomogramMasters = (sequelize: Sequelize, db: IModelCollection) => (
    <TomogramMasterStatic>sequelize.define('tomogramMaster', {
        id: {
            type: DataTypes.INTEGER,
            field: 'ID',
            primaryKey: true,
            autoIncrement: true
        },
        opid: {
            type: DataTypes.INTEGER,
            field: 'OPRegisterID',
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            field: 'DateTime',
            allowNull: false,
            // defaultValue: DataTypes.NOW
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        narration: {
            type: DataTypes.STRING(100),
            field: 'Narration',
            allowNull: false,
        },
        doctorId: {
            type: DataTypes.INTEGER,
            field: 'DoctorID',
            allowNull: false
        },
        formNo: {
            type: DataTypes.INTEGER,
            field: 'No'
            // allowNull: false
        },
        tomogramTypeId: {
            type: DataTypes.INTEGER,
            field: 'TomogramTypeID',
            allowNull: false
        }
    }, {
        tableName: 'TomogramMaster',
        timestamps: false,
        hooks: {
            beforeCreate: async (instance: ITomogramMaster, options) => {
                //check latest entry
                let maxFormNoValue: number = await db.main.TomogramMasters?.max('formNo') || 0;
                // instance.no = tomMaster
                instance.setDataValue('formNo', maxFormNoValue + 1);
                // let date = Sequelize.fn('CURRENT_TIMESTAMP');
                // instance.setDataValue('DateTime', date);
            }
        }
    })
);


