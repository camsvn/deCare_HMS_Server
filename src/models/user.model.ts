// import sequelize from '../providers/Database';
import {DataTypes, Model, Sequelize} from 'sequelize';

export interface IUserInstance extends Model {
    ID: number;
    Username: string;
    Password: string;
    ClientID: number;
    FinancialYearID: number;
    ParentUserID: number;
    CompanyID: number;
    ReportDays: number;
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

// class User extends Model {
//     public ID!: number;
//     public Username!: string;
//     public Password!: string;
//     public ClientID!: number;
//     public FinancialYearID!: number;
//     public ParentUserID!: number;
//     public CompanyID!: number;
//     public ReportDays!: number;
// } 

// User.init({
//     ID: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         allowNull: false
//     },
//     Username: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     Password: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     ClientID: {
//         type: Sequelize.INTEGER,
//         allowNull: false
//     },
//     FinancialYearID: {
//         type: Sequelize.INTEGER,
//         allowNull: false
//     },
//     ParentUserID: {
//         type: Sequelize.INTEGER,
//         allowNull: true
//     },
//     CompanyID: {
//         type: Sequelize.INTEGER,
//         allowNull: false
//     },
//     ReportDays: {
//         type: Sequelize.INTEGER,
//         allowNull: true
//     }
// },{
//     sequelize,
//     tableName: 'User'
// });

// export {User};


