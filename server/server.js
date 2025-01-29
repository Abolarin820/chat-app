const express = require('express');
const cors = require('cors');
const connectDB = require('./config/connectDB');
const router = require('./routes');
require('dotenv').config();
const cookiesParser =require('cookie-parser')
const {app, server} = require('./socket/index')

//App configur
const port = process.env.PORT || 8080
// const app = express()


//Middleware
app.use(express.json())
app.use(cookiesParser())

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true,
    allowedHeaders: ['Content-Type']
}))



app.get('/', (request,response)=>{
    response.json({
        message: 'Server runing on port ' + port
    })
})

//Api endpoints
app.use('/api/',router)

connectDB().then(()=>{
    server.listen(port, ()=>{
        console.log('App Running on Port ' + port)
    })
});
