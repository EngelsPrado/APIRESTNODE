
require('./config/config')

const express = require('express')
const mongoose = require('mongoose');
const path=require('path')
<<<<<<< HEAD
const cors = require("cors");


const app = express()
var corsOptions = {
   origin: "http://localhost:8081"
 };
 
 app.use(cors(corsOptions));
=======



const app = express()
>>>>>>> 8c4ca9bf318f47034656429570cabee570e97b57
const bodyParser = require('body-parser')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//Habilitar la carpeta public

app.use(express.static(path.resolve( __dirname, '../public')))



//Configuracion global de rutas

app.use(require('./routes/index'))


const uri = process.env.MONGO_URI
mongoose.connect(uri,(err,res)=>{

   if (err) throw err

   console.log('BD ONLINE');

})


app.listen(process.env.PORT)