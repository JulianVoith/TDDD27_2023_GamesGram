import { createContext, useState } from 'react';

const Context = createContext();

export const Provider = ({ children }) => {
  const [nFriends, setFriends] = useState(0);
  const [userInfo,setuserInfo] = useState(null);
  const [nFollower, setFollower] = useState(0);

  return (
    <Context.Provider value={{ nFriends, setFriends,userInfo,setuserInfo,nFollower,setFollower }}>
      {children}
    </Context.Provider>
  );
};

export default Context;