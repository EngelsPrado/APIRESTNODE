const express = require('express')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario=require('../models/usuario')

const app = express()


app.post('/login',(req,res)=>{
  
    let body=req.body 
    
    Usuario.findOne({email:body.email},(err,usuarioBD)=>{


        if (err){
  
            return  res.status(500).json({
                ok:false,
                err
              })
          } 


         if(!usuarioBD){
            return  res.status(400).json({
                ok:false,
                err:{
                    message:'(Usuario) o contra incorrectos'
                }
              })
         } 

        if( ! bcrypt.compareSync(body.password,usuarioBD.password)){
             
            return  res.status(400).json({
                ok:false,
                err:{
                    message:'Usuario o (contra) incorrectos'
                }
              }) 
        }

        let token=jwt.sign({
            usuario:usuarioBD
        },process.env.SEED_TOKEN,{expiresIn:process.env.CADUCIDAD_TOKEN})

        res.json({
            ok:true,
            usuario:usuarioBD,
            token
        }) 
    })

  
   
})

//Configuraciones de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
   
    console.log(payload.name)
    console.log(payload.email)
    console.log(payload.picture)


    return {
        nombre:payload.name,
        email:payload.email,
        img:payload.picture,
        google:true
    }
  }



app.post('/google', async (req,res)=>{

  let token=req.body.idtoken
 
  //Verificar el token
   let googleUser=await  verify(token).catch(err=>{
       return res.status(403).json({
           ok:false,
           err:err
       })
   })
 
   Usuario.findOne({email:googleUser.email},(err,usuarioBD)=>{
    if(err){
        return  res.status(500).json({
            ok:false,
            err
          })
     } 

     if (usuarioBD){

           if(usuarioBD.google===false){
                return  res.status(400).json({
                    ok:false,
                    err:{
                        message:'Debe de usar su autentificacion normal'
                    }
                  })
             }else{
                let token=jwt.sign({
                    usuario:usuarioBD
                },process.env.SEED_TOKEN,{expiresIn:process.env.CADUCIDAD_TOKEN})
        


                return res.json({
                    ok:true,
                    usuario:usuarioBD,
                    token
                })
             } 
           } 
        
     else{
        //Si el usuario no existe en la BD


        let usuario=new Usuario()
  
         usuario.nombre=googleUser.nombre,
         usuario.email=googleUser.email
         usuario.img=googleUser.img
         usuario.google=true
         usuario.password=':)'

         usuario.save((err,usuarioBD)=>{
            if(err){
                return  res.status(500).json({
                    ok:false,
                    err
                  })
             } 
             let token=jwt.sign({
                usuario:usuarioBD
            },process.env.SEED_TOKEN,{expiresIn:process.env.CADUCIDAD_TOKEN})
    

            
            return res.json({
                ok:true,
                usuario:usuarioBD,
                token
            })
         })
     }
     



   })



})







module.exports=app