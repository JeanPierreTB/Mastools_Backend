import { DataTypes } from "sequelize";
import {sequelize} from "../database/database.js"
import { Producto } from "./Producto.js";
import { Administrador_Producto } from "./Administrador_Producto.js";

export const Administrador=sequelize.define("Administrador",{
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


Administrador.belongsToMany(Producto,{
    through:Administrador_Producto
})

Producto.belongsToMany(Administrador,{
    through:Administrador_Producto
})