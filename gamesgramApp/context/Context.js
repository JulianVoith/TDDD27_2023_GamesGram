import { createContext, useState } from 'react';

const Context = createContext();


//Context for information about the logged in user (to provide it to every component)
export const Provider = ({ children }) => {
  const [userInfo,setuserInfo] = useState(null);

  return (
    <Context.Provider value={{ userInfo,setuserInfo }}>
      {children}
    </Context.Provider>
  );
};

export default Context;