import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Producto } from "./Producto.js";
import { Administrador } from "./Administrador.js";

export const Administrador_Producto = sequelize.define("Administrador_Producto", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    precio_total: {
        type: DataTypes.FLOAT
    },
    cantidadcomprada: {
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true,
});

Administrador.belongsToMany(Producto, {
    through: {
        model: Administrador_Producto,
        unique: false 
    }
});

Producto.belongsToMany(Administrador, {
    through: {
        model: Administrador_Producto,
        unique: false 
    }
});