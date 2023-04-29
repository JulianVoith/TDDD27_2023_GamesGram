import { useRouter } from 'next/router';

import { useEffect, useState } from 'react';
import {GetUserInfo} from '@/components/Tools/getUserInfo'
import Sidebar from '@/components/Siderbar';
import Profile from '@/components/Profile';
import styles from '@/styles/Home.module.css';

const UserProfile = ({ userData }) => {
  const [userInfo,setUserInfo] = useState(null);
  const [myInfo,setMyInfo] = useState(null);
  const router = useRouter();
  const { steamid } = router.query;

    //constant for the sidebar selection css which is passed as a prop
    const SidebarSelect = 
                          {home: "nav-link text-white",
                          search: "nav-link text-white",
                          reels: "nav-link text-white",
                          teamMates: "nav-link text-white",
                          profile: "nav-link active",
                          signout: "nav-link text-white"};

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

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userInfo === null&&steamid) {
        console.log("Search")
        const data = await GetUserInfo(steamid);
        if (data) {
          setUserInfo(data[0]);
        }
      }
    };
  
    fetchUserInfo();
  }, [steamid, userInfo]);
 
  return (
    <main>
    <div className={styles.main}>
      {myInfo &&  <div className={styles.one}><Sidebar selection={SidebarSelect} userInfo={myInfo}/></div>}
      {userInfo ? <Profile userInfo={userInfo} />:404}
    </div>
</main>
  );
};



export default UserProfile;