import { Server } from "socket.io";

export default async function SocketHandler(req, res) {

    if (res.socket.server.io) {
        console.log("Already set up");
        res.end();
        return;
      }

    const io = new Server(res.socket.server); 
    /*{cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }});*/
    res.socket.server.io = io;
    
    io.on("connection", (socket) => {
        socket.on("send-message", (obj) => {
        io.emit("receive-message", obj);
        });
    });
    
    console.log("Setting up socket");
    io.listen(3000);
    res.end();

}

