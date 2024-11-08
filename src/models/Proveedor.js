import { DataTypes } from "sequelize";
import {sequelize} from "../database/database.js";
import { Producto } from "./Producto.js";


export const Proveedor=sequelize.define("Proveedor",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    nombre:{
        type:DataTypes.STRING
    },
    apellido:{
        type:DataTypes.STRING
    },
    correo:{
        type:DataTypes.STRING
    },
    contrasena:{
        type:DataTypes.STRING
    },
    dni:{
        type:DataTypes.INTEGER
    },
    foto:{
        type:DataTypes.STRING
    }
})



Proveedor.hasMany(Producto,{
    foreignKey:'proveedorID'
})

Producto.belongsTo(Proveedor,{
    foreignKey:'proveedorID'
})