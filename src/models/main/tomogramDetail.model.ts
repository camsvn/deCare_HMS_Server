import {DataTypes, Sequelize, Model, BuildOptions} from 'sequelize';

export const TomogramDetail = (sequelize: Sequelize) => (
    <TomogramDetailStatic>sequelize.define('tomogramDetail', {
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        MasterID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        TomogramPartID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Narration: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, {
        tableName: 'TomogramDetail',
        timestamps: false
    })
);

export interface ITomogramDetail extends Model {
    readonly id: number;
    readonly masterid: number;
    readonly tomogrampartid: number;
    readonly narration: string;
}

export type TomogramDetailStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ITomogramDetail;
}


