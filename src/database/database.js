import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
    'Mastools',//nombre de la base de datos 
    'postgres', //tu usuario postgresql
    'postgres', //tu contraseña postgresql
    {
    host: 'localhost',      
    dialect: 'postgres',  
    }
);





