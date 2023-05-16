import { useRouter } from 'next/router';

import { useEffect, useState } from 'react';
import {GetUserInfo} from '@/components/Tools/getUserInfo'
import {GetUserMedia} from '@/components/Tools/getUsermedia'
import Sidebar from '@/components/Siderbar';
import Profile from '@/components/Profile';
import styles from '@/styles/Home.module.css';

const UserProfile = ({ userData }) => {
  const [userInfo,setUserInfo] = useState(null);
  const [myInfo,setMyInfo] = useState(null);
  const [mediaPosts,setMediaPosts] = useState(null);
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

//fetch logged-in user information on login
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

  //fetch inspected user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userInfo === null&&steamid) {
        const data = await GetUserInfo(steamid);
        if (data) {
          setUserInfo(data[0]);
        }
      }
    };
  
    fetchUserInfo();
  }, [steamid, userInfo]);

  //fetch posted media for inspected or logged-in user by steamid
  useEffect(() => {
      const fetchPostData = async () =>{
        if(mediaPosts === null && steamid){
          const posts = await GetUserMedia(steamid);
          if(posts){
            setMediaPosts(posts);
          }
        }
      };

      fetchPostData();
  }, [mediaPosts]);

  return (
    <main>
    <div className={styles.main}>
      {myInfo &&  <div className={styles.one}><Sidebar selection={SidebarSelect} userInfo={myInfo}/></div>}
      {userInfo ? <Profile userInfo={userInfo} media={mediaPosts} />:404}
    </div>
</main>
  );
};



export default UserProfile;