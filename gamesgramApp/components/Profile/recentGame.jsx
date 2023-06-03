import Context from "@/context/Context";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { useEffect, useState, useContext } from "react";
import styles from "@/styles/Profile.module.css";

//Component for recent games of a user
//TODO commenting!
export default function RecentGame(props) {
  const { userInfo } = useContext(Context);
  //const [recentGame, setRecentGame] = useState(null);
  const steamid = props.steamid || userInfo.steamid;

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: recentGame } = useSWR(
    `/api/GetRecentlyPlayedGames/${steamid}`,
    fetcher
  );

  //Effect to transmit back the game to the profile to fetch its name for media upload (category)
  useEffect(() => {
    if (recentGame) {
      props.onGameSet(recentGame);
    }
  }, [recentGame, props.onGameSet]);

  return (
    <div className={styles.gameContainer}>
      {recentGame ? (
        recentGame.map((gameInfo) => (
          <Game key={gameInfo.appid} gameInfo={gameInfo} />
        ))
      ) : (
        <p>No recent games available</p>
      )}
    </div>
  );
}

//Function to represent the game on the profile
function Game(props) {
  const url = `https://avatars.akamai.steamstatic.com/${props.gameInfo.img_icon_url}_full.jpg`;
  const gameInfo = props.gameInfo;
  return (
    <div className={styles.gameIterm}>
      <Link href={`/game/${gameInfo.appid}`}>
        <Image
          src={url}
          alt={gameInfo.name}
          width={50}
          height={50}
          className={"rounded-circle"}
        />
        <div className={styles.name}>{gameInfo.name} </div>
      </Link>
    </div>
  );
}
