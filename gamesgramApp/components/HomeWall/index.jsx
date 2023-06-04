import { useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import Post from "@/components/Post";
import styles from "@/styles/Home.module.css";
import { GetUserInfo } from "../Tools/getUserInfo";

//Component for the post wall of the home section of the platform
const HomeWall = (props) => {
  const media = props.media;
  const [posterInfo, setPosterInfo] = useState(null);

  //Fetching poser information on mount
  useEffect(() => {
    if (!posterInfo) {
      fetchPosterInfo();
    }
  }, []);

  //Function to fetch information of the original poster
  const fetchPosterInfo = async () => {
    const data = await GetUserInfo(media.steamid);
    setPosterInfo(data[0]);
  };

  //Return home post wall
  return (
    <div className={styles.homeWall}>
      {posterInfo ? (
        <>
          <div className={styles.posterInfo}>
            <Link href={`http://localhost:3000/${posterInfo.steamid}`}>
              <Image
                src={posterInfo.avatarfull}
                width={50}
                height={50}
                className="rounded-circle mr-2"
                alt={posterInfo.personaname}
              />
            </Link>
            <p>{posterInfo.personaname}</p>
          </div>
          <p className={styles.timestamp}>{media.timestamp}</p>
          <Post
            key={media.filenam}
            postID={media.filenam}
            descr={media.descr}
          />
        </>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
};

export default HomeWall;
