import { createContext, use, useEffect, useState } from "react";
import { GetUserInfo } from "@/components/Tools/getUserInfo";

const Context = createContext();

//Context for information about the logged in user (to provide it to every component)
export const Provider = ({ children }) => {

  //Data Hook for the logged in user information
  const [userInfo, setuserInfo] = useState(null);

  //Fetch logged in user information on reload into the context
  const GetuserInfo = async () => {
    if (!userInfo && window.localStorage.getItem("token")) {
      const data = await GetUserInfo();
      setuserInfo(data[0]);
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
