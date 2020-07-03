const express=require('express')

let {verificaToken} = require('../middlewares/autenticacion')


let app = express()
const _=require('underscore')

let Producto= require('../models/producto')


//
// Obtener todos los productos
//



//Mostrar todas las categorias
app.get('/productos',verificaToken,(req,res)=>{

    let desde=req.query.desde || 0
    desde=Number(desde)

    Producto.find({disponible:true}).
    skip(desde).
    limit(5).
    sort('nombre').
    populate('usuario','nombre email').
    populate('categoria','descripcion').
    
    exec((err,productos)=>{
        if (err){
  
            return  res.status(400).json({
                ok:false,
                err
              })
          } 

   

        res.json({
            ok:true,
            productos,
       
        })
      
          
      
    })
     
})

//Mostrar una categoria por ID
app.get('/productos/:id',verificaToken,(req,res)=>{

 //Categoria.findById

  let id=req.params.id

  
  Producto.findById(id).
  populate('usuario','nombre email').
  populate('categoria','descripcion')
  .exec((err,productos)=>{
    if (err){

        return  res.status(400).json({
            ok:false,
            err
          })
      } 


      if (!productos){
        return res.status(400).json({
            ok:false,
            err:{
                message:'Id no existe'
            }
        })
    }

    res.json({
        ok:true,
        productos,
   
    })
  
      
  
})
  

})

app.get('/productos/buscar/:termino',verificaToken,(req,res)=>{


  let termino=req.params.termino

  let regex=new RegExp(termino,'i')

   Producto.find({nombre:regex})
   .populate('categoria','descripcion')
   .exec((err,producto)=>{

    if (err){

        return  res.status(400).json({
            ok:false,
            err
          })
      } 



    res.json({
        ok:true,
        producto,
   
    })


   })


})

app.post('/productos',verificaToken,(req,res)=>{

  //Regresa la nueva categoria
  //req.usuario._id
  let body=req.body
  let nombre=body.nombre
  let precioUni=body.precioUni
  let descripcion=body.descripcion
  let categoria=body.categoria
  let usuario=req.usuario._id
  
 let producto=new Producto({
    nombre,
    precioUni,
    descripcion,
    disponible:true,
    categoria,
     usuario
 }) 

  producto.save((err,producto)=>{
    if (err){
  
      return  res.status(400).json({
          ok:false,
          err
        })
    } 

 
     res.json({
         ok:true,
         producto
     })


  })

  
   
})


app.put('/productos/:id',verificaToken,(req,res)=>{

    let id=req.params.id
    let body=req.body


    Producto.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,producto)=>{

   
        if (err){
  
            return  res.status(400).json({
                ok:false,
                err
              })
          } 
        
        res.json({
            ok:true,
            producto
          }) 
    })
 


})

app.delete('/productos/:id',verificaToken,(req,res)=>{

  //Solo un ADMON
//Categoria.findByIdandRemove

            
    let id=req.params.id
    body={
        disponible:false
    }

    Producto.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,producto)=>{


    if (err){

        return  res.status(400).json({
            ok:false,
            err
        })
    } 
    
    res.json({
        ok:true,
        producto
    }) 
    })


})






module.exports=app