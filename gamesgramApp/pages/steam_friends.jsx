
import { useContext,useEffect, useState } from 'react';
import Context from '@/context/Context';
import {GetUserInfo} from '@/components/Tools/getUserInfo'
import {Card} from '@/components/Search';
import styles from '@/styles/Home.module.css';
import Sidebar from '@/components/Siderbar';


//TODO commenting and check if it works!
const SteamFriends = () => {

  const [FriendsInfo,setFriendsInfo] = useState(null)
  const [myInfo,setMyInfo] = useState(null);
  const { nFriends } = useContext(Context);

  //Constant for the sidebar selection highlight which is passed as a prop to child components
  const SidebarSelect = 
      {home: "nav-link text-white",
      search: "nav-link text-white",
      reels: "nav-link text-white",
      teamMates: "nav-link text-white",
      profile: "nav-link active",
      signout: "nav-link text-white"};

  let steamidArray = undefined
  let steamidString = undefined

  if(nFriends.length !== 0)
  {
    steamidArray = nFriends.map(friend => friend.steamid);
    steamidString = steamidArray.join(',');
  }

  useEffect(()=>{
    const fetchUserInfo = async () => {
        if(steamidString!==undefined)
        {const data = await GetUserInfo(steamidString);
        setFriendsInfo(data);}
      };
  
      fetchUserInfo();
  },[nFriends,steamidString])

  useEffect(() => {

    const fetchMyInfo = async () => {

      if (myInfo === null) {
        const data = await GetUserInfo();
        if (data) {
          setMyInfo(data[0]);
        }
      }
    };

    fetchMyInfo();
  }, [myInfo]);

  return (
    <div className={styles.main}>
      {myInfo &&  <div className={styles.one}><Sidebar selection={SidebarSelect} /></div>}
      <div className={styles.two}>
    {FriendsInfo!==null?  
    FriendsInfo.map((FriendInfo)=><Card key={FriendInfo.steamid} userInfo={FriendInfo }/>)
    : <p>Loading...</p>}
    </div>
    </div>
  );
};

export default SteamFriends;