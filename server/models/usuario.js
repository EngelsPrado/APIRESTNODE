const moongose=require('mongoose')
const uniqueValidator=require('mongoose-unique-validator')


let rolesValidos={
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un rol valido'
}
let Schema= moongose.Schema

let usuariosSchema=new Schema({
    nombre:{
        type:String,
        required:[true,'El nombre es necesario']
    },
    email:{
        type:String,
        unique:true,
        required:[true,'El correo esd necesario']
    },
    password:{
        type:String,
        required:[true,'La contra es obligatoria']
    },
    img:{
       type:String,
       required:false 
    },
    role:{
        type:String,
        default:'USER_ROLE',
        enum:rolesValidos
    },
    estado:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    }
    
})


usuariosSchema.methods.toJSON=function(){

   let user=this
   let userObject=user.toObject()
   delete userObject.password

   return userObject

}

//Validaciones
usuariosSchema.plugin(uniqueValidator,{
    message:'{PATH} debe ser unico'
})


module.exports=moongose.model('Usuario',usuariosSchema)