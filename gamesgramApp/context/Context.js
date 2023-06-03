import { createContext, use, useEffect, useState } from "react";

const Context = createContext();

//Context for information about the logged in user (to provide it to every component)
export const Provider = ({ children }) => {
  const [userInfo, setuserInfo] = useState(null);
  const GetuserInfo = async () => {
    if (!userInfo && window.localStorage.getItem("token")) {
      // API endpoint where we send form data.
      const endpoint = "/api/GetUserInfo";
      // Form the request for sending data to the server.
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: window.localStorage.getItem("token"),
        },
      };

      // Send the form data to our forms API on Vercel and get a response.
      const response = await fetch(endpoint, options);
      const data = await response.json();
      setuserInfo(data.response.players[0]);
    }
  };
  useEffect(() => {
    if (!userInfo) {
      GetuserInfo();
    }
  }, [userInfo]);
  return (
    <Context.Provider value={{ userInfo, setuserInfo }}>
      {children}
    </Context.Provider>
  );
};

export default Context;
