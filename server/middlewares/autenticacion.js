
//==============
// Verificar token
//===============
const jwt=require('jsonwebtoken')

let verificaToken=(req,res,next)=>{

    let token = req.get('token');
    console.log(token) 
    jwt.verify(token,process.env.SEED_TOKEN, (err, decoded) => {

        console.log(err)
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

}

//==============
// Verificar token
//===============
let verificaRol=(req,res,next)=>{

  let usuario=req.usuario

  if(usuario.role!=='ADMIN_ROLE')
 {
  return res.json({
      ok:false,
      err:{
          message:'El usuario no es administrador'
      }
  })
}

  next()
}



// 

let verificaTokenImg=(req,res,next)=>{

    let token=req.query.token

    jwt.verify(token,process.env.SEED_TOKEN, (err, decoded) => {

        console.log(err)
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

     
}



module.exports={verificaToken,verificaRol,verificaTokenImg}