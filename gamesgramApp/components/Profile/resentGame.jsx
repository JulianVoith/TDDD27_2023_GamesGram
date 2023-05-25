import Context from '@/context/Context';
import Image from 'next/image';
import { useEffect, useState, useContext } from 'react';
import styles from '@/styles/Profile.module.css';

export default function RecentGame(props) {
  const { userInfo } = useContext(Context);
  const [recentGame, setRecentGame] = useState(null);
  const steamid = props.steamid || userInfo.steamid;

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
    if (data && data !== 404) {  // Check if data is valid before setting state
      setRecentGame(data);
    }
  };
  useEffect(() => {
    if (!recentGame) { getGame(); }
  }, [recentGame, steamid]);

  //transmit Game to farther component => profile
  useEffect(() => {
    if (recentGame) {  // Only call onGameSet if recentGame is not null
      props.onGameSet(recentGame);
    }
  }, [recentGame]);
  return (
    <div className={styles.gameContainer}>
      {recentGame ? recentGame.map((gameInfo) => <Game key={gameInfo.appid} gameInfo={gameInfo} />) : <p>Loading...</p>}
    </div>
  )
}

function Game(props) {
  const url = `https://avatars.akamai.steamstatic.com/${props.gameInfo.img_icon_url}_full.jpg`
  const gameInfo = props.gameInfo;
  return (
    <div className={styles.gameIterm}>
      <Image src={url} alt={gameInfo.name} width={50} height={50} className={"rounded-circle"} />
      <div className={styles.name}>{gameInfo.name} </div>
    </div>
  )
}