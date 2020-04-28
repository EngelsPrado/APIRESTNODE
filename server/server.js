
require('./config/config')

const express = require('express')
const mongoose = require('mongoose');




const app = express()
const bodyParser = require('body-parser')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'))
 
const uri = "mongodb+srv://engels:amores@cluster0-fqrop.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri,(err,res)=>{

   if (err) throw err

   console.log('BD ONLINE');

})


app.listen(process.env.PORT)