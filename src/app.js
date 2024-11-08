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
  const{descripcion,cantidad,imagen,precio,tipo,proveedorID} =req.body

  if(!descripcion || !cantidad || !imagen || !precio || !tipo || !proveedorID){
    return res.status(400).json({res:false,mensaje:"Llena todos los campos"})

  }

  const proveedor=await Proveedor.findOne({where:{id:proveedorID}})


  if(!proveedor){
    return res.status(400).json({res:false,mensaje:"Proveedor no encontrado"})

  }


  const producto=await Producto.create({descripcion,cantidad,imagen,precio,tipo,proveedorID})

  res.status(200).json({res:true,mensaje:"Producto creado",producto:producto})

})


app.get('/obtener-productos/:id',async (req,res)=>{

  const {id}=req.params;

  if(!id){
    return res.status(400).json({res:false,mensaje:"Llena todos los campos"})

  }

  const proveedor=await Proveedor.findOne({where:{id}})

  if(!proveedor){
    return res.status(400).json({res:false,mensaje:"Proveedor no encontrado"})
  }
  const productos=await Producto.findAll({where:{proveedorID:id}})


  if(productos.length===0){
    return res.status(404).json({res:false,mensaje:"Nos se encontraron productos"})
  }

  res.status(200).json({res:true,mensaje:"Productos encontrados",productos,productos})
})


app.put('/actualizar-proveedor',async(req,res)=>{
  const { id,nombre, apellido, correo, contrasena, dni } = req.body;

  if (!id || !nombre || !apellido || !correo || !contrasena || !dni) {
    return res.status(400).json({ res: false, mensaje: "Llena todos los campos" });
  }

  const [proveedor]=await Proveedor.update({nombre,apellido,correo,contrasena,dni},{where:{id}})

  if(proveedor===0){
    return res.status(400).json({res:false,mensaje:"Ningun proveedor encontrado"})

  }

  return res.status(200).json({res:true,mensaje:"Se actualizo el proveedor"})

})


app.put('/actualizar-producto',async (req,res)=>{
  const {id,descripcion,cantidad,imagen,precio,tipo,proveedorID}=req.body;

  if(!id || ! descripcion || !cantidad || !imagen || !precio || !tipo || !proveedorID){
    return res.status(400).json({res:false,mensaje:"Llena todos los campos"})

  }

  const proveedor=await Proveedor.findOne({where:{id:proveedorID}})

  if(!proveedor){
    return res.status(400).json({res:false,mensaje:"Proveedor no encontrado"})
  }



  const [producto]=await Producto.update(
    {descripcion,cantidad,imagen,precio,tipo,proveedorID},
    {where:{id}}
  )

  if(producto===0){
    return res.status(400).json({res:false,mensaje:"Ningun producto encontrado"})
  }

  return res.status(200).json({res:true,mensaje:"Se actualizo el producto"})


})

app.delete('/borrar-producto',async(req,res)=>{
  const {id}=req.body;

  if(!id){
    return res.status(400).json({res:false,mensaje:"Llena todos los campos"})

  }  
  const producto=await Producto.destroy({where:{id}})

  if(producto===0){
    return res.status(400).json({res:false,mensaje:"Ningun producto encontrado"})
  }
  return res.status(200).json({res:true,mensaje:"Se borro el producto",producto:producto})
})



app.post('/comprar-producto',async(req,res)=>{
  const {id_producto,cantidad,precio,id_administrador}=req.body;

  if(!id_producto || !id_administrador || !cantidad || !precio){
    return res.status(400).json({res:false,mensaje:"Llena todos los campos"})

  }



  const total=cantidad*precio;

  const producto=await Producto.update({cantidad:cantidad-1})

  const administrador_producto=await Administrador_Producto({ProductoId:id_producto,AdministradorId:id_administrador,precio_total:total,estado:true})
  

  return res.status(200).json({res:true,mensaje:"Se compro producto",administrador_producto:administrador_producto})


  
})


app.get('/productos-massolicitados/:proveedorID',async(req,res)=>{
  const {proveedorID}=req.params;

  const productos=await Producto.findAll({proveedorID})

  console.log(productos)

  if(productos.length===0){
    return res.status(400).json({res:false,mensaje:"No hay productos"})

  }





  
  
})




app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    verificarconexion();
});
