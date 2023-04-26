import { useRouter } from 'next/router';
import { useContext,useEffect, useState } from 'react';
import FriendsContext from '@/context/FriendsContext';
import {GetUserInfo} from '@/components/Tools/getUserInfo'
import {Card} from '@/components/Search'
import styles from '@/styles/Home.module.css';
import Sidebar from '@/components/Siderbar';

const SteamFriends = () => {
  const router = useRouter();
  const [page, setPage] = useState("search");
  const [FriendsInfo,setFriendsInfo] = useState(null)
  const [myInfo,setMyInfo] = useState(null);
  const { nFriends } = useContext(FriendsContext);

  let steamidArray = undefined
  let steamidString = undefined
  if(nFriends.length !== 0)
  {
    steamidArray = nFriends.map(friend => friend.steamid);
    steamidString = steamidArray.join(',');
  }
  const handleNavigation = (nav) => {
    setPage(nav);
  }
  useEffect(()=>{
    const fetchUserInfo = async () => {
        if(steamidString!==undefined)
        {const data = await GetUserInfo(steamidString);
        console.log(data)
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
      {myInfo &&  <div className={styles.one}><Sidebar navigate={handleNavigation} userInfo={myInfo}/></div>}
      <div className={styles.two}>
    {FriendsInfo!==null?  
    FriendsInfo.map((FriendInfo)=><Card key={FriendInfo.steamid} userInfo={FriendInfo }/>)
    : <p>Loading...</p>}
    </div>
    </div>
  );
};

export default SteamFriends;