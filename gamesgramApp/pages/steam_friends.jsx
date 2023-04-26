import { useRouter } from 'next/router';
import { useContext,useEffect, useState } from 'react';
import FriendsContext from '@/context/FriendsContext';
import {GetUserInfo} from '@/components/Tools/getUserInfo'
import {Card} from '@/components/Search'


const SteamFriends = () => {
  const router = useRouter();
  const [FriendsInfo,setFriendsInfo] = useState(null)
  const { nFriends } = useContext(FriendsContext);

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
        console.log(data)
        setFriendsInfo(data);}
      };
  
      fetchUserInfo();
  },[nFriends,steamidString])
  console.log(steamidString)
  return (
    <div>
    {FriendsInfo!==null?  
    FriendsInfo.map((FriendInfo)=><Card key={FriendInfo.steamid} userInfo={FriendInfo }/>)
    : <p>Loading...</p>}
    </div>
  );
};

export default SteamFriends;