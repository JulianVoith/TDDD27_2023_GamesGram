import '@/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import { Provider } from '../context/Context';
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }) {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Establish the WebSocket connection
      const ws = new WebSocket("ws://127.0.0.1:5000/");
      setSocket(ws);

      ws.onopen = function (event) {
        let payload = {
          steamid: localStorage.getItem('steamid'),
          //HEX: sha256(localStorage.getItem('token'))
      };
        ws.send(JSON.stringify(payload));
      };

      ws.onmessage = function (event) {
        console.log(`Received: ${event.data}`);
      };

      // Clean up the WebSocket connection when this component unmounts
      return function cleanup() {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    }
  }, []);

  
  return (
    <Provider>
      <Component {...pageProps} socket={socket}/>
    </Provider>
  );
}
