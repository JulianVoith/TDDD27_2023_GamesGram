import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {GetUserInfo} from '@/components/Tools/getUserInfo'
import HomeMain from '@/components/Home';
import Sidebar from '@/components/Siderbar';
import Profile from '@/components/Profile';
import Search from '@/components/Search';
import styles from '@/styles/Home.module.css';

const UserProfile = ({ userData }) => {
  const [page, setPage] = useState("search");
  const [userInfo,setUserInfo] = useState(null);
  const [myInfo,setMyInfo] = useState(null);
  const router = useRouter();
  const { steamid } = router.query;

  const handleNavigation = (nav) => {
    setPage(nav);
}
  //Helper function to change rendering
  function RenderNavigatedPage(){
    if(page == "home"){
        
    }else if(page == "search"){
        return <Search classname=""/>;
    }else if(page == "reels"){
        
    }else if(page == "teamMates"){
        
    }else{
        return <Profile classname="" userInfo={userInfo} />;
    } 
}

  useEffect(() => {

    const fetchMyInfo = async () => {

      if (myInfo === null) {
        const data = await GetUserInfo();
        if (data) {
          setMyInfo(data);
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
          setUserInfo(data);
        }
      }
    };
  
    fetchUserInfo();
  }, [steamid, userInfo]);
  console.log(userInfo)
  return (
    <main>
    <div className={styles.main}>
      {myInfo &&  <div className={styles.one}><Sidebar navigate={handleNavigation} userInfo={myInfo}/></div>}
      {userInfo && <Profile userInfo={userInfo} />}
    </div>
</main>
  );
};



export default UserProfile;