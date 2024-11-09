import { DataTypes } from "sequelize";
import {sequelize} from "../database/database.js"

export const Producto=sequelize.define("Producto",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    descripcion:{
        type:DataTypes.STRING
    },
    cantidad:{
        type:DataTypes.INTEGER
    },
    imagen:{
        type:DataTypes.TEXT
    },
    precio:{
        type:DataTypes.FLOAT
    },
    tipo:{
        type:DataTypes.STRING
    }
},{
    freezeTableName:true
})