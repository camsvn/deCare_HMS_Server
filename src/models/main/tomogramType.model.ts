import {DataTypes, Sequelize, Model} from 'sequelize';

export const TomogramType = (sequelize: Sequelize) => (sequelize.define('tomogramType', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'TomogramType',
    timestamps: false
}));

export interface ITomogramInstance extends Model {
    id: number;
    name: string;
}


