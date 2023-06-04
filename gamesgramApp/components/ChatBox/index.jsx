import { useEffect, useState } from "react";
import Pusher from "pusher-js";

//Component for real-time chat on the Game Page
const ChatBox = (props) => {

  //Data hooks for sent messages, written, nessage, chatroom and username
  const [messages, setMessages] = useState(null);
  const [message, setMessage] = useState(null);
  const [username] = useState(props.userName);
  const [appid] = useState(props.appid);
  let allMessages = [];

  //Pusherlistener for incoming messages
  useEffect( () => {

        var pusher = new Pusher('eb86425f6a7666bc669d', {
          cluster: 'eu'
        });
    
        var channel = pusher.subscribe("GamesGram");

        channel.bind(appid, function(data) {
          allMessages.push(data);
          setMessages(allMessages);
        });
  });

  //submit function for chat message
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