import express from 'express'; 
import { sequelize } from './database/database.js';


const app = express();
const PORT = process.env.PORT || 3001;

const verificarconexion = async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
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
