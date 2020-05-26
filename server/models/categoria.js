const moongose=require('mongoose')
const uniqueValidator=require('mongoose-unique-validator')



let Schema= moongose.Schema


let categoriaSchema= new Schema({
    descripcion:{
        type:String,unique:true,required:[true]
    },
    usuario:{type:Schema.Types.ObjectId,ref:'Usuario'}
})


module.exports=moongose.model('Categoria',categoriaSchema)