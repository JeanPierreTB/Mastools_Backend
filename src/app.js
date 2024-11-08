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
      await sequelize.sync();
      console.log("Conexion a base de datos exitosa");
    } catch (e) {
      console.error("No se logró conectar ", e);
    }
};

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Servidor de Mastools');
});

app.post('/insertar-proveedor', async (req, res) => {
  const { nombre, apellido, correo, contrasena, dni } = req.body;

  if (!nombre || !apellido || !correo || !contrasena || !dni) {
    return res.status(400).json({ res: false, mensaje: "Llena todos los campos" });
  }

  const proveedor = await Proveedor.create({ nombre, apellido, correo, contrasena, dni });

  res.status(200).json({ res: true, mensaje: "Proveedor creado", proveedor: proveedor });
});



app.post('/insertar-administrador',async(req,res)=>{
  const {nombre,apellido,correo,contrasena,dni}=req.body;

  if(!nombre || !apellido || !correo || !contrasena || !dni){
    return res.status(400).json({res:false,mensaje:"Llena todos los campos"})
  }

  const administrador=await Administrador.create({nombre,apellido,correo,contrasena,dni})

  res.status(200).json({res:true,mensaje:"Administrador creado",administrador:administrador})
})



app.post('/crear-producto',async(req,res)=>{
  const{descripcion,cantidad,imagen,precio,tipo} =req.body

  if(!descripcion || !cantidad || !imagen || !precio || !tipo){
    return res.status(400).json({res:false,mensaje:"Llena todos los campos"})

  }

  const producto=await Producto.create({descripcion,cantidad,imagen,precio,tipo})

  res.status(200).json({res:true,mensaje:"Producto creado",producto:Producto})

})


app.get('/obtener-productos')

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    verificarconexion();
});
