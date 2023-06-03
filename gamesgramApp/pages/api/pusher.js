import Pusher from "pusher";

//Pusher api file to send data to the pusher servers

//create pusher variable with needed information
const pusher = new Pusher({

  app_id: "1611665",
  key: "eb86425f6a7666bc669d",
  secret: "4cb4d60a715c44b81ce6",
  cluster:"eu"
  //useTLS: true
});

//request handler function which is contacting the pusher servers
export default async function handler(req, res) {

  console.log(req.body);
  const { username, message, appid } = req.body;
  console.log(username);
  console.log("HAAALLOOOOO")
  await pusher.trigger(appid, appid, req.body).then(console.log).catch(e => console.log(e));

  res.json({ message: "completed" });
}

/*
export default async function handler(req, res) {

    if (res.socket.server.io) {
        console.log("Already set up");
        res.end();
        return;
      } */

    //const io = new Server(res.socket.server); 
    /*{cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }});*/
   /* res.socket.server.io = io;
    
    io.on("connection", (socket) => {
        socket.on("send-message", (obj) => {
        io.emit("receive-message", obj);
        });
    });
    
    console.log("Setting up socket");
    io.listen(3000);
    res.end();

} */

