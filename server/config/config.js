



//
// PUERTO
//


process.env.PORT = process.env.PORT || 3000
process.env.MONGO_URI=process.env.MONGO_URI || "mongodb+srv://engels:amores@cluster0-fqrop.mongodb.net/test?retryWrites=true&w=majority"




//Vencimiento del token

process.env.CADUCIDAD_TOKEN=60*60*24


//SEED de autentificacion
process.env.SEED_TOKEN=process.env.SEED_TOKEN || 'secret'