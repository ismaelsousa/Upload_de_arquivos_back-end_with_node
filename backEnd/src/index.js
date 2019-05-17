require('dotenv').config();
const path = require('path')
const express = require("express")
const app = express();
//faz logos
const morgan = require('morgan')
const mongoose = require('mongoose')

//banco de dados
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))
app.use('/files', express.static(path.resolve(__dirname, '..','tmp','uploads')))


app.use(require('./routes'))

app.listen(3000, function(){
    console.log("server rodando")
});