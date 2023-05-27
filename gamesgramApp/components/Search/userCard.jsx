import Card from "./card";
import styles from '@/styles/Search.module.css';
import {GetUserInfo} from '@/components/Tools/getUserInfo';
import { useEffect, useState } from 'react';



//TODO: commenting
export default function UserCard(props){
    const [usersInfo, setUsersInfo] = useState(null);
  
    useEffect(() => {
      const fetchUserInfo = async () => {
        if(props.steamid)
        {const data = await GetUserInfo(props.steamid);
        setUsersInfo(data);
    }
      };
  
      fetchUserInfo();
    }, [props.steamid]);
    
    // Render the component
    return (
      <div className={styles.resultItem}>
        {usersInfo !==null ? 
            usersInfo.map((userInfo)=><Card key={userInfo.steamid} userInfo={userInfo}/>)
         : (
          <p>Loading...</p>
        )}
      </div>
    );
  }