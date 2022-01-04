import {DataTypes, Sequelize, Model, BuildOptions} from 'sequelize';

export interface ITomogramDetail extends Model {
    readonly id: number;
    readonly masterid: number;
    readonly tomogrampartid: number;
    readonly narration: string;
}

export type TomogramDetailStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ITomogramDetail;
}

export const TomogramDetails = (sequelize: Sequelize) => (
    <TomogramDetailStatic>sequelize.define('tomogramDetail', {
        id: {
            type: DataTypes.INTEGER,
            field: 'ID',
            primaryKey: true,
            autoIncrement: true,
        },
        masterid: {
            type: DataTypes.INTEGER,
            field: 'MasterID',
            allowNull: false
        },
        tomogrampartid: {
            type: DataTypes.INTEGER,
            field: 'TomogramPartID',
            allowNull: false
        },
        narration: {
            type: DataTypes.STRING(100),
            field: 'Narration',
            allowNull: false
        }
    }, {
        tableName: 'TomogramDetail',
        timestamps: false
    })
);


