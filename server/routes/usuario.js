
const express = require('express')
const app = express()
const bcrypt=require('bcrypt')
const _=require('underscore')
const Usuario=require('../models/usuario')
const {verificaToken,verificaRol}=require('../middlewares/autenticacion')
app.get('/usuario', verificaToken,function (req, res) {
    
    /*
   return res.json({
     usuario:req.usuario
   })
*/


    let desde=req.query.desde || 0
    desde=Number(desde)

    let limite= req.query.limite || 5
    limite=Number(limite)
    Usuario.find({estado:true},'nombre email role estado google img') //filtrar campos
    .skip(desde)
    .limit(limite)
    .exec((err,usuarios)=>{
        if (err){
  
            return  res.status(400).json({
                ok:false,
                err
              })
          } 

      Usuario.count({estado:true},(err,conteo)=>{

        res.json({
            ok:true,
            usuarios,
            conteo
        })
      })

          
      
    })

  })
   
  
  //Nuevo registros
  app.post('/usuario', [verificaToken,verificaRol],function (req, res) {
  
    let body=req.body
  

    
   let usuario=new Usuario({
       nombre:body.nombre,
       email:body.email,
       password: bcrypt.hashSync(body.password,10),
       role:body.role
   })
  usuario.save((err,usuarioBD)=>{
    if (err){
  
      return  res.status(400).json({
          ok:false,
          err
        })
    } 

   // usuarioBD.password=null

     res.json({
         ok:true,
         usuario:usuarioBD
     })


  })
   
    
  })
   
  //actualizar
  app.put('/usuario/:id', [verificaToken,verificaRol],function (req, res) {
  
  
    let id=req.params.id
    let body=_.pick( req.body,['nombre','email','img','role','estado'])


    Usuario.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,usuarioBD)=>{

   
        if (err){
  
            return  res.status(400).json({
                ok:false,
                err
              })
          } 
        
        res.json({
            ok:true,
            usuario:usuarioBD
          }) 
    })
 

   
  })
   
  app.delete('/usuario/:id', [verificaToken,verificaRol],function (req, res) {
   
        
       let id=req.params.id
       body={
           estado:false
       }
 
       Usuario.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,usuarioBD)=>{

   
        if (err){
  
            return  res.status(400).json({
                ok:false,
                err
              })
          } 
        
        res.json({
            ok:true,
            usuario:usuarioBD
          }) 
    })

/*
       Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{
        if (err){
  
            return  res.status(400).json({
                ok:false,
                err
              })
          } 
             

          if (!usuarioBorrado){
            return  res.status(400).json({
                ok:false,
                err:{
                    message:'Usuario no encontrado'
                }
              })
          }

          res.json({
              ok:true,
              usuario:usuarioBorrado
          })
       })
*/
  })

  module.exports=app