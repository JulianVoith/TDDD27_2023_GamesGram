import { createContext, useState } from 'react';

const FriendsContext = createContext();

export const FriendsProvider = ({ children }) => {
  const [nFriends, setFriends] = useState(0);

  return (
    <FriendsContext.Provider value={{ nFriends, setFriends }}>
      {children}
    </FriendsContext.Provider>
  );
};

export default FriendsContext;