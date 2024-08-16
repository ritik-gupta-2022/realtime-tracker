import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import path from "path";
import { fileURLToPath } from 'url';


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//setting our view engine as ejs
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));  //adding public to our path

io.on("connection",(socket)=>{
   socket.on("send-location", (data)=>{
        io.emit("receive-location", {id:socket.id, ...data});  
    })

    //trigerring disconnect event
    socket.on("disconnect", ()=>{
        io.emit("user-disconnect", socket.id);
    })
})

app.get("/", (req,res)=>{
    res.render("index");
})

httpServer.listen("3000", (req,res)=>{
    console.log("Server connected");
})
