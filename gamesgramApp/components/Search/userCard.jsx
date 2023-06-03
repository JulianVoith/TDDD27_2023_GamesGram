import Card from "./card";
import styles from '@/styles/Search.module.css';
import {GetUserInfo} from '@/components/Tools/getUserInfo';
import { useEffect, useState } from 'react';

//Component to create a user card list based on suggestion search
export default function UserCard(props){

    //Data hook for user information (searched user)
    const [usersInfo, setUsersInfo] = useState(null);

    //Effect to fetch user information of the given steamid
    useEffect(() => {
      const fetchUserInfo = async () => {
        if(props.steamid)
        {const data = await GetUserInfo(props.steamid);
        setUsersInfo(data);
    }
      };
  
      fetchUserInfo();
    }, [props.steamid]);
    
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