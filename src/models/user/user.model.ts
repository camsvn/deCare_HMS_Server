import {DataTypes, Model, Sequelize, BuildOptions} from 'sequelize';

export const User = (sequelize: Sequelize) => (
    <UserInstanceStatic>sequelize.define('user', {
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        Username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ClientID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        FinancialYearID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ParentUserID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        CompanyID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ReportDays: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'User',
        timestamps: false
    })
);

export interface IUserInstance extends Model {
    readonly id: number;
    readonly username: string;
    readonly password: string;
    readonly clientId: number;
    readonly financialYearId: number;
    readonly parentUserId: number;
    readonly companyId: number;
    readonly reportDays: number;
}

export type UserInstanceStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IUserInstance;
}