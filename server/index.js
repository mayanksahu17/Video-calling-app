import express from 'express'
import bodyParser from 'body-parser'
import {Server  } from 'socket.io'

const io = new Server({
    cors : true
}) 
const app = express()

app.use(bodyParser)

const emailToSocketMap = new Map()
const socketToEmailMapping = new Map()

io.on('connection' ,(socket)=>{
    console.log("new connection ");
    socket.on('join-room', data =>{
        const {roomId , emailId } = data ;
        console.log('User', emailId,'joined room');
        emailToSocketMap.set(emailId , socket.Id)
        socketToEmailMapping.set(socket.id , emailId)
        socket.join(roomId);
        socket.emit('joined-room' , {roomId})
        socket.broadcast.to(roomId).emit('user-joined',{emailId})
    })
    socket.on("call-user" , (data)=>{
        const {emailId , offer } = data;
        const fromEmail = socketToEmailMapping.get(socket.id)
        const socketId = emailToSocketMap.get(emailId)
        socket.to(socket).emit('incomming-call', {from : fromEmail , offer})
     })
})


app.listen(8000,()=>{
    console.log(`http server is running on 8000`);
})

io.listen(8001)