import {DataTypes, Sequelize, Model, BuildOptions} from 'sequelize';

export const TomogramType = (sequelize: Sequelize) => (
    <TomogramTypeStatic>sequelize.define('tomogramType', {
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        Name: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    }, {
        tableName: 'TomogramType',
        timestamps: false
    })
);

export interface ITomogramType extends Model {
    readonly id: number;
    readonly name: string;
}

export type TomogramTypeStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ITomogramType;
}


