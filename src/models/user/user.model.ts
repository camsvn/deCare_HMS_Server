import {DataTypes, Model, Sequelize} from 'sequelize';

export interface IUserInstance extends Model {
    id: number;
    username: string;
    password: string;
    clientId: number;
    financialYearId: number;
    parentUserId: number;
    companyId: number;
    reportDays: number;
}

export const User = (sequelize: Sequelize) => (sequelize.define('user', {
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
}));