import {DataTypes, Sequelize, Model, BuildOptions} from 'sequelize';
import { IModelCollection } from '..';

export interface IOpRegister extends Model {
    readonly id: number;
    readonly opid: number;
    readonly name: string;
}

export type OpRegisterStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IOpRegister;
}

export const OpRegisters = (sequelize: Sequelize, db: IModelCollection) => (
    <OpRegisterStatic>sequelize.define('OpRegisters', {
        id: {
            type: DataTypes.INTEGER,
            field: 'ID',
            primaryKey: true,
            autoIncrement: true
        },
        opid: {
            type: DataTypes.INTEGER,
            field: 'OPNo',
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(100),
            field: 'Name',
            allowNull: false,
        }
    }, {
        tableName: 'OPRegister',
        timestamps: false,
    })
);


