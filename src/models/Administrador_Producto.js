import { DataTypes } from "sequelize";
import {sequelize} from "../database/database.js"

export const Administrador_Producto=sequelize.define("Administrador_Producto",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true

    },
    precio_total:{
        type:DataTypes.FLOAT
    },
    estado:{
        type:DataTypes.BOOLEAN
    }
})