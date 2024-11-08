import express from 'express'; 
import { sequelize } from './database/database.js';
import { Proveedor } from './models/Proveedor.js';
import { Administrador } from './models/Administrador.js';
import { Producto } from './models/Producto.js';
import { Administrador_Producto } from './models/Administrador_Producto.js';



const app = express();
const PORT = process.env.PORT || 3001;

const verificarconexion = async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync({force:true});
      console.log("Conexion a base de datos exitosa");
    } catch (e) {
      console.error("No se logró conectar ", e);
    }
};

app.get('/', (req, res) => {
    res.send('Servidor de Mastools');
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    verificarconexion();
});
