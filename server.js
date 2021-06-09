const path = require('path')
const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const hbs = require('hbs')
const server = require('http').Server(app)
const io = require('socket.io')(server,{
    cors : {origin:"*"}
})


//define paths for express config
const publicDirectoryPath = path.join(__dirname,'public')
const viewsPath = path.join(__dirname,'public/views')
const partialsPath = path.join(__dirname,'public/partials')
// setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)
//  setup static directory to serve
app.use(express.static(path.join(publicDirectoryPath)))

app.get('/broadcast',(req,res)=>{
    res.render("broadcast",{
        type:"Broadcast"
    })
})
app.get('/listen',(req,res)=>{
    res.render("listen",{
        type:"Listen"
    })
})

io.on('connection',(socket)=>{
    console.log("someone connected")
    socket.on('message',(message)=>{
        console.log(message)
        // io.emit('message',message)
        socket.broadcast.emit('message',message)
    })
    socket.on('sdpExchange',(sdp)=>{
        console.log('user connected to server with id = ', sdp);
        socket.broadcast.emit('sdpExchange',sdp);
    })
})

server.listen(port,()=>{
    console.log("server started on port " + port)
});