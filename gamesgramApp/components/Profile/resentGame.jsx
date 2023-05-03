import Image from 'next/image';
import Context from '@/context/Context';
import { useEffect, useState, useContext } from 'react';
import styles from '@/styles/Profile.module.css';

export default function RecentGame(props){
    const {userInfo} = useContext(Context); 
    const [recentGame,setRecentGame] = useState(undefined);
    const steamid = props.steamid || userInfo.steamid;
    useEffect(() => {
        if (recentGame) return;
      
        const getGame = async () => {
          const endpoint = `/api/GetRecentlyPlayedGames/${steamid}`;
          const options = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'token': window.localStorage.getItem("token"),
            },
          };
          const response = await fetch(endpoint, options);
          const data = await response.json();
          if(data!==recentGame){
            console.log("data",data)}
          setRecentGame(data);
        };
      
        getGame();
      }, [steamid]);

    console.log("recentGame",recentGame? recentGame.map((gameInfo)=>console.log(gameInfo.name)):console.log("loading"))
    return(
        <div className={styles.gameContainer}>
            {recentGame? recentGame.map((gameInfo)=><Game key={gameInfo.appid} gameInfo={gameInfo}/>) :<p>Loading...</p>}
        </div>
    )
}

function Game(props){
    const url=`https://avatars.akamai.steamstatic.com/${props.gameInfo.img_icon_url}_full.jpg`
    
    return(
        <div className={styles.gameIterm}>
            <img src={url} alt={gameInfo.name} />
            <div className={styles.name}>{props.gameInfo.name} </div>
        </div>
    )
}