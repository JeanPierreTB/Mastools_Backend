import express from 'express'; 
import cors from 'cors';
import { sequelize } from './database/database.js';
import { Proveedor } from './models/Proveedor.js';
import { Administrador } from './models/Administrador.js';
import { Producto } from './models/Producto.js';
import { Administrador_Producto } from './models/Administrador_Producto.js';
import { Solicitud } from './models/Solicitud.js';
import { Op, where } from 'sequelize';


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

app.use(cors({
  origin:'http://localhost:3000'
}))

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



app.post('/iniciar-sesion',async(req,res)=>{
  const {correo,contrasena}=req.body;

  if(!correo || !contrasena){
    return res.status(404).json({res:false,mensaje:"Llena todos los campos"})
  }

  const usuario=await Proveedor.findOne({where:{correo,contrasena}})


  if(usuario){
    return res.status(200).json({res:true,mensaje:"Inicio de sesion exitoso",usuario:usuario, rol: 0})
  }

  const admin=await Administrador.findOne({where:{correo,contrasena}})

  if(!admin){
    return res.status(404).json({res:false,mensaje:"No se encontro usuario"})
  }

  return res.status(200).json({res:true,mensaje:"Inicio de sesion exitoso",usuario:admin, rol: 1})
})


app.post('/cambiar-contrasena', async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ res: false, mensaje: "Llena todos los campos" });
  }

  const proveedorUpdate = await Proveedor.update({ contrasena }, { where: { correo } });

  if (proveedorUpdate[0] > 0) {
    return res.status(200).json({ res: true, mensaje: "Contraseña de proveedor actualizada" });
  }

  const adminUpdate = await Administrador.update({ contrasena }, { where: { correo } });

  if (adminUpdate[0] > 0) {
    return res.status(200).json({ res: true, mensaje: "Contraseña de administrador actualizada" });
  }

  return res.status(404).json({ res: false, mensaje: "No se encontró usuario con ese correo" });
});


app.get('/obtener-datos-proveedor/:id',async(req,res)=>{
  const {id}=req.params;

  const usuario=await Proveedor.findOne({where:{id}})

  if(!usuario){
    return res.status(400).json({ res: false, mensaje: "Usuario no existe" });

  }

  return res.status(200).json({ res: true, mensaje: "Proveedor obtenidos",usuario:usuario });


})

app.get('/obtener-datos-administrador/:id',async(req,res)=>{
  const {id}=req.params;

  const usuario=await Administrador.findOne({where:{id}})

  if(!usuario){
    return res.status(400).json({ res: false, mensaje: "Administrador no existe" });

  }

  return res.status(200).json({ res: true, mensaje: "Administrador obtenidos",usuario:usuario });


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

  res.status(200).json({res:true,mensaje:"Productos encontrados",productos:productos})
})


app.get('/obtener-productos-disponibles',async(req,res)=>{
  const productos=await Producto.findAll({where:{cantidad:{[Op.gt]:0}}});

  if(productos.length===0){
    return res.status(404).json({res:false,mensaje:"Nos se encontraron productos"})

  }

  return res.status(200).json({res:true,mensaje:"Se encontraron productos",productos:productos})
})


app.put('/actualizar-proveedor',async(req,res)=>{
  const { id,nombre, apellido, correo, contrasena, dni ,foto} = req.body;

  if (!id || !nombre || !apellido || !correo || !contrasena || !dni ) {
    return res.status(400).json({ res: false, mensaje: "Llena todos los campos" });
  }

  const [proveedor]=await Proveedor.update({nombre,apellido,correo,contrasena,dni,foto},{where:{id}})

  if(proveedor===0){
    return res.status(400).json({res:false,mensaje:"Ningun proveedor encontrado"})

  }

  return res.status(200).json({res:true,mensaje:"Se actualizo el proveedor"})

})

app.put('/actualizar-administrador',async(req,res)=>{
  const { id,nombre, apellido, correo, contrasena, dni ,foto} = req.body;

  if (!id || !nombre || !apellido || !correo || !contrasena || !dni ) {
    return res.status(400).json({ res: false, mensaje: "Llena todos los campos" });
  }

  const [administrador]=await Administrador.update({nombre,apellido,correo,contrasena,dni,foto},{where:{id}})

  if(administrador===0){
    return res.status(400).json({res:false,mensaje:"Ningun administrador encontrado"})

  }

  return res.status(200).json({res:true,mensaje:"Se actualizo el administradors"})

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
  const {id_producto,id_administrador,cantidad}=req.body;

  if(!id_producto || !id_administrador || !cantidad){
    return res.status(400).json({res:false,mensaje:"Llena todos los campos"})

  }


  const producto=await Producto.findOne({where:{id:id_producto}})

  if(!producto){
    res.status(404).json({res:false,mensaje:"Producto no existe"})
  }

  const total=cantidad*producto.precio;

 

  const producto2 = await Producto.update(
    { cantidad: producto.cantidad-cantidad },
    { where: { id: id_producto } }
  );



  const administrador_producto=await Administrador_Producto.create({ProductoId:id_producto,AdministradorId:id_administrador,precio_total:total,cantidadcomprada:cantidad})
  

  return res.status(200).json({res:true,mensaje:"Se compro producto",administrador_producto:administrador_producto})


  
})


app.post('/realizar-solicitud',async(req,res)=>{
  const {descripcion,fecha_solicitud,fecha_envio,imagen,cantidad,AdministradorId,ProveedorId}=req.body;

  if(!descripcion || !fecha_solicitud || !cantidad || !fecha_envio || !imagen || !AdministradorId || !ProveedorId){
    return res.status(404).json({res:false,mensaje:"Llena todos los campos"})
  }

  const solicitud=await Solicitud.create({descripcion,cantidad,fecha_solicitud,fecha_envio,imagen,AdministradorId,ProveedorId,atendido:false});

  return res.status(200).json({res:true,mensaje:"Solicitud enviada",solicitud:solicitud})


})


app.get('/visualizar-solicitudes/:ProveedorId', async (req, res) => {
  const { ProveedorId } = req.params;

  if (!ProveedorId) {
    return res.status(404).send({ res: false, mensaje: "Llena los campos" });
  }

  const today = new Date();

  const solicitudes = await Solicitud.findAll({
    where: { 
      ProveedorId,
      atendido: false
    },
    order: [
      ['fecha_envio', 'ASC']  
    ]
  });

  if (solicitudes.length === 0) {
    return res.status(404).send({ res: false, mensaje: 'No hay solicitudes' });
  }

  return res.status(200).send({ res: true, mensaje: 'Solicitudes', solicitud: solicitudes });
});


app.put('/atender-solicitud',async(req,res)=>{
  const{id}=req.body;

  if(!id){
    return res.status(404).json({res:false,mensaje:"Llena todos los campos"})
  }

  const solicitud=await Solicitud.update({atendido:true},{where:{id}});

  return res.status(200).json({res:true,mensaje:"Solicitud atendida",solicitud:solicitud})

})


app.get('/productos-estadisticas/:proveedorID', async (req, res) => {
  const { proveedorID } = req.params;

  const productos = await Producto.findAll({ where: { proveedorID } });

  if (productos.length === 0) {
    return res.status(400).json({ res: false, mensaje: "No hay productos" });
  }
  
  const ids = productos.map(producto => producto.id);
  
   
  const resultado = await Administrador_Producto.findAll({
    where: { ProductoId: ids }
  });

  const sumaPrecios = {};
  const sumaCantidades = {};

  resultado.forEach(item => {
    sumaPrecios[item.ProductoId] = (sumaPrecios[item.ProductoId] || 0) + item.precio_total;
    sumaCantidades[item.ProductoId] = (sumaCantidades[item.ProductoId] || 0) + item.cantidadcomprada;
  });

  const productosCompletos = await Producto.findAll({
    where: { id: Array.from(Object.keys(sumaPrecios)) }
  });

  const productosMap = new Map();
  productosCompletos.forEach(producto => {
    productosMap.set(producto.id, producto);
  });

  const resultadoFinal = Object.keys(sumaPrecios).map(id => {
    const producto = productosMap.get(Number(id)); 
    return {
      ProductoId: Number(id), 
      precio_total: sumaPrecios[id],  
      cantidadcomprada: sumaCantidades[id],  
      Producto: {
        id: producto.id,
        imagen: producto.imagen,
        descripcion: producto.descripcion,
      }
    };
  });

  const resultadoOrdenado = resultadoFinal.sort((a, b) => b.cantidadcomprada - a.cantidadcomprada);

  return res.send({ res: true, mensaje: "Productos ordenados por cantidad comprada", resultado: resultadoOrdenado });

  

});





app.get('/productos-bajostock/:proveedorID', async (req, res) => {
  const { proveedorID } = req.params;

  try {
    const productos = await Producto.findAll({
      where: { proveedorID },
      order: [['cantidad', 'ASC']], 
    });

    if (productos.length === 0) {
      return res.status(400).json({ res: false, mensaje: "No hay productos" });
    }

    return res.json({ res: true, mensaje:"Productos obtenidos",productos });

  } catch (error) {
    return res.status(500).json({ res: false, mensaje: "Error en el servidor", error: error.message });
  }
});







app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    verificarconexion();
});
