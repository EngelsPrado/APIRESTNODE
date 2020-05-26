const express=require('express')

let {verificaToken,verificaRol} = require('../middlewares/autenticacion')


let app = express()
const _=require('underscore')

let Categoria= require('../models/categoria')



//Mostrar todas las categorias
app.get('/categoria',verificaToken,(req,res)=>{

  
    Categoria.find({}).
    sort('descripcion').
    populate('usuario','nombre email').
    
    exec((err,categorias)=>{
        if (err){
  
            return  res.status(400).json({
                ok:false,
                err
              })
          } 

   

        res.json({
            ok:true,
            categorias,
       
        })
      
          
      
    })
     
})

//Mostrar una categoria por ID
app.get('/categoria/:id',verificaToken,(req,res)=>{

 //Categoria.findById

  let id=req.params.id

  
  Categoria.findById(id).exec((err,categorias)=>{
    if (err){

        return  res.status(400).json({
            ok:false,
            err
          })
      } 


      if (!categorias){
        return res.status(400).json({
            ok:false,
            err:{
                message:'Id no existe'
            }
        })
    }

    res.json({
        ok:true,
        categorias,
   
    })
  
      
  
})
  

})

app.post('/categoria',verificaToken,(req,res)=>{

  //Regresa la nueva categoria
  //req.usuario._id
  let body=req.body
  let usuario=req.usuario._id
  
 let categoria=new Categoria({
     descripcion:body.descripcion,
     usuario
 }) 

  categoria.save((err,categoriaBD)=>{
    if (err){
  
      return  res.status(400).json({
          ok:false,
          err
        })
    } 

 
     res.json({
         ok:true,
         categoria:categoriaBD
     })


  })

  
   
})


app.put('/categoria/:id',verificaToken,(req,res)=>{

    let id=req.params.id
    let body=_.pick( req.body,['descripcion'])


    Categoria.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,categoria)=>{

   
        if (err){
  
            return  res.status(400).json({
                ok:false,
                err
              })
          } 
        
        res.json({
            ok:true,
            categoria
          }) 
    })
 


})

app.delete('/categoria/:id',[verificaToken,verificaRol],(req,res)=>{

  //Solo un ADMON
//Categoria.findByIdandRemove

        let id=req.params.id
        
        Categoria.findByIdAndRemove(id).exec((err,categoria)=>{

   
            if (err){
      
                return  res.status(400).json({
                    ok:false,
                    err
                  })
              } 
            
           if (!categoria){
               return res.status(400).json({
                   ok:false,
                   err:{
                       message:'Id no existe'
                   }
               })
           }

            res.json({
                ok:true,
                categoria
              }) 
        })
})




module.exports=app