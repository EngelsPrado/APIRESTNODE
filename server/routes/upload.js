const express=require('express')
const fileupload=require('express-fileupload')
const app=express()


const Usuario=require('../models/usuario')
const Producto=require('../models/producto')
const fs=require('fs')
const path=require('path')
app.use(fileupload())


app.put('/upload/:tipo/:id',function(req,res){

   let tipo=req.params.tipo
   let id=req.params.id


   if (!req.files)
   {
       return res.status(400).json({
           ok:false,
           err:{
               message:'No se ha seleccionado ningun archivo'
           }
       })
   }
  
  //Validar tipo

  let tiposValidos=['productos','usuarios']
  if (tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok:false,
            err:{
                message:'Los tipos validos permitidos son'+tiposValidos.join(', ')
            }
        })
    }


   let sampleFile=req.files.archivo 
   let nombreCortado=sampleFile.name.split('.')
   let extension=nombreCortado[nombreCortado.length-1]
   console.log(extension) 
   //Extensiones permitidas
   
   let extensionesValidas=['png','jpg','gif','jpeg']
    
   if (extensionesValidas.indexOf(extension)<0){
       return res.status(400).json({
           ok:false,
           err:{
               message:'Las extensiones permitidas son'+extensionesValidas.join(', ')
           }
       })
   }


  //Cambiar nombre el archivo
  
  let nombreArchivo=`${id}-${new Date().getMilliseconds()}.${extension}`

    // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(`uploads/${tipo}/${nombreArchivo}`, function(err) {
    if (err)
      return res.status(500).json({
          ok:false,
          err
      });
     
   //Aqui la imagen ya se cargo


   if(tipo=='usuarios')
    imagenUsuario(id,res,nombreArchivo)
   else
      imagenProducto(id,res,nombreArchivo)

   
  });

})



function imagenUsuario(id,res,nombreArchivo){

   Usuario.findById(id,(err,usuario)=>{
        if(err){
            borraArchivo(nombreArchivo,'usuarios')
            return res.status(500).json({
                ok:false,
                err
            })
        }

     if(!usuario){
         borraArchivo(nombreArchivo,'usuarios')
        return res.status(400).json({
            ok:false,
            err
        })
     }


     borraArchivo(usuario.img,'usuarios')


     usuario.img=nombreArchivo
     usuario.save((err,usuario)=>{

        res.json({
            ok:true,
            usuario,
            img:nombreArchivo
        })

      })


   })
  

}

function imagenProducto(id,res,nombreArchivo){

    
   Producto.findById(id,(err,producto)=>{
        if(err){
            borraArchivo(nombreArchivo,'productos')
            return res.status(500).json({
                ok:false,
                err
            })
        }

     if(!producto){
         borraArchivo(nombreArchivo,'productos')
        return res.status(400).json({
            ok:false,
            err
        })
     }


     borraArchivo(producto.img,'productos')


     producto.img=nombreArchivo
     producto.save((err,product)=>{

        res.json({
            ok:true,
            product,
            img:nombreArchivo
        })

      })


   })
  
}

function borraArchivo(nombreImagen,tipo){
      let pathUrl= path.resolve(__dirname,`../../uploads/${tipo}/${nombreImagen}`)
      //Borrando la imagen anterior
      if(fs.existsSync(pathUrl)){
          fs.unlinkSync(pathUrl)
      } 
}
module.exports=app