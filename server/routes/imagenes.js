const express=require('express')



const fs=require('fs')
const path=require('path')
const app=express()
const {verificaTokenImg} =require('../middlewares/autenticacion')





app.get('/imagen/:tipo/:img',verificaTokenImg,(req,res)=>{


   let tipo=req.params.tipo
   let img=req.params.img
    

    let pathUrl= path.resolve(__dirname,`../../uploads/${tipo}/${img}`)
  
    if (fs.existsSync(pathUrl)){
        res.sendFile(pathUrl)
    } else{
        let noImagen=path.resolve(__dirname,'../assets/152 no-image.jpg') 
        res.sendFile(noImagen) 
    } 
    
   
       
    

})





module.exports=app