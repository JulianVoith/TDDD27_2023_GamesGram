import { useEffect, useState } from "react";
import Pusher from "pusher-js";


const ChatBox = (props) => {

  const [messages, setMessages] = useState(null);
  const [message, setMessage] = useState(null);
  const [username] = useState(props.userName);
  const [appid] = useState(props.appid);
  let allMessages = [];


  console.log(username);
  console.log(appid);
  useEffect( () => {
        // Enable pusher logging - don't include this in production
        Pusher.logToConsole = true;

        var pusher = new Pusher('eb86425f6a7666bc669d', {
          cluster: 'eu'
        });
    
        var channel = pusher.subscribe("GamesGram");
        channel.bind(appid, function(data) {
          allMessages.push(data);
          setMessages(allMessages);
        });
  });

  const submit = async (e) => {
    e.preventDefault();

    await fetch('/api/pusher', {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username,
        message,
        appid, 
      })
    });
    setMessage();

  }

  return (
  <div className="container">
    <div className="row">
        <div className="panel panel-default">
          <div className="panel-heading">Chat</div>
          <div className="panel-body">
            <div className="container">
              {messages ? messages.map(message => {
                  <div className="row message-bubble">
                  <p className="text-muted">{message.username}</p>
                      <span>{message.message}</span>
                  </div>
                }):null}
            </div>
            <div className="panel-footer">
                 <div className="input-group">
                  <form id="commentInputForm" onSubmit={submit}>
                          <input required onChange={(e) => setMessage(e.target.value)} value={message} type="text" className="form-control" placeholder="Enter your message..." id="messageBox"/>
                  </form>
                </div>
            </div>
          </div>
        </div>
    </div>
</div>
  );

};

export default ChatBox;


/*    /*useEffect(() => {
        socketInitializer();
    
        return () => {
          socket.disconnect();
        };
      }, []);
    
      async function socketInitializer() {
        await fetch("http://localhost:3000/api/socket"); ////"proxy": "http://localhost:5001/"
    
        socket = io();

        socket.on('connect', () => {
          console.log("connected");
        })
    
        socket.on("receive-message", (data) => {
            setAllMessages((pre) => [...pre, data]);
        });
      }
    
      function handleSubmit(e) {
        e.preventDefault();

        console.log("emitted");
    
        socket.emit("send-message", {
          username,
          message
        });
    
        setMessage("");
      }
    */




      /*       return (
      <div>
        <h1>Chat app</h1>
        <h1>Enter a username</h1>
  
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
  
        <br />
        <br />
  
        <div>
          {allMessages.map(({ username, message }, index) => (
            <div key={index}>
              {username}: {message}
            </div>
          ))}
  
          <br />
  
          <form onSubmit={handleSubmit}>
            <input
              name="message"
              placeholder="enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              autoComplete={"off"}
            />
          </form>
        </div>
      </div>
    );*/