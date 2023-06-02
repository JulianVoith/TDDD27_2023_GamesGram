import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useEffect, useState, useContext } from 'react';
import {GetUserInfo} from '@/components/Tools/getUserInfo'
import Sidebar from '@/components/Siderbar';
import Profile from '@/components/Profile';
import styles from '@/styles/Home.module.css';
import PostWall from '@/components/PostWall';
import HomeWall from '@/components/HomeWall';
import Post from '@/components/Post';
import { Modal } from 'react-bootstrap';
import Context from '@/context/Context';

export default function Game()
{
    const router = useRouter();
    const { appid } = router.query;
    const [gameInfo, setGameInfo] = useState(undefined);
    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    const { data: gameNews } = useSWR(`/api/getGameNews/${appid}`, fetcher);
    const { data: gamePosts } = useSWR(`/api/getGame/${appid}`, fetcher);
//chat page

//Left : Sidebar
//Center : News/#Posts about the game
//Right : Chat

//if a user opens this page -> create websocket -> you cn chat


  //Constant for the sidebar selection highlight which is passed as a prop to child components
  const SidebarSelect = 
                        {home: "nav-link text-white",
                        search: "nav-link text-white",
                        reels: "nav-link text-white",
                        teamMates: "nav-link active",
                        profile: "nav-link text-white",
                        signout: "nav-link text-white"};

return (
    <main>
        <div className={styles.main}>
            <div className={styles.one}>
                <Sidebar selection={SidebarSelect}/>
            </div>
            <div className={styles.two}>
                {gameNews&&<News news={gameNews[0]}/>}
              {gamePosts ? gamePosts.map((gamePost) => <HomeWall key={gamePost.filenam} id={gamePost.filenam} media={gamePost} />) : <p>Here will be our Game page by default</p>}
            </div>
        </div>
    </main>
)
}

//possiblity with get static path etc

function News(props)
{
    const news = props.news;
    const contents = convertStringToHtml(news.contents);
    return(
        <>  
        <div dangerouslySetInnerHTML={{ __html: contents }} />
        </>
    )
}

function convertStringToHtml(str) {
    // replace [br] by <br>
    str = str.replace(/\[br\]/g, '<br>');

    // replace [h?] by <h?>
    str = str.replace(/\[h3\]/g, '<h3>');
    str = str.replace(/\[\/h3\]/g, '</h3>');
    // replace [b] by <strong>
    str = str.replace(/\[b\]/g, '<strong>');
    str = str.replace(/\[\/b\]/g, '</strong>');

    str = str.replace('{STEAM_CLAN_IMAGE}', 'https://clan.cloudflare.steamstatic.com/images/');
    str = str.replace('{STEAM_CLAN_LOC_IMAGE}', 'https://cdn.akamai.steamstatic.com/steamcommunity/public/images/clans');

    str = str.replaceAll(/\[previewyoutube=(.*?);full\](\[\/previewyoutube\])?/g, (match, videoId) => {
        return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
      });
      
    // relace [img] by <img>
    str = str.replace(/\[img\]/g, '<img style="display: inline-block; max-width: 100%;" src="');
    str = str.replace(/\[\/img\]/g, '" />');
    // replace [url] by <a>
    str = str.replace(/\[url=(.*?)\]/g, '<a href="$1" target="_blank">');
    str = str.replace(/\[\/url\]/g, '</a>');
    // add new line between paragraphs
    str = str.replace(/\n/g, '<br>');
    return str;
  }