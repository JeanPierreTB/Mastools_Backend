import { DataTypes } from "sequelize";
import {sequelize} from "../database/database.js";
import { Proveedor } from "./Proveedor.js";
import { Administrador } from "./Administrador.js";



export const Solicitud=sequelize.define("Solicitud",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    descripcion:{
        type:DataTypes.STRING
    },
    fecha_solicitud:{
        type:DataTypes.DATEONLY
    },
    fecha_envio:{
        type:DataTypes.DATEONLY
    },
    imagen:{
        type:DataTypes.STRING
    },
    cantidad:{
        type:DataTypes.INTEGER
    },
    atendido:{
        type:DataTypes.BOOLEAN
    }
},{
    freezeTableName:true
})


Administrador.belongsToMany(Proveedor, {
    through: {
        model: Solicitud,
        unique: false 
    }
});

Proveedor.belongsToMany(Administrador, {
    through: {
        model: Solicitud,
        unique: false 
    }
});