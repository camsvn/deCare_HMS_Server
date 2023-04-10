import {DataTypes, Sequelize, Model, BuildOptions} from 'sequelize';
import { IModelCollection } from '..';

export interface ISettings extends Model {
    readonly id: number;
    readonly key: number;
    readonly value: string;
}

export type SettingsStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ISettings;
}

export const Settings = (sequelize: Sequelize, db: IModelCollection) => (
    <SettingsStatic>sequelize.define('Settings', {
        id: {
            type: DataTypes.INTEGER,
            field: 'ID',
            primaryKey: true,
            autoIncrement: true
        },
        opid: {
            type: DataTypes.STRING(50),
            field: 'Key',
            allowNull: false
        },
        value: {
            type: DataTypes.STRING(50),
            field: 'Value',
            allowNull: false,
        }
    }, {
        tableName: 'Settings',
        timestamps: false,
    })
);