import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useEffect, useState, useContext } from 'react';
import Sidebar from '@/components/Siderbar';
import styles from '@/styles/Game.module.css';
import HomeWall from '@/components/HomeWall';
import Context from '@/context/Context';
import Head from 'next/head';
import ChatBox from '@/components/ChatBox';

export default function Game()
{
    const router = useRouter();
    const { appid } = router.query;
    const [gameInfo, setGameInfo] = useState(undefined);
    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    const { data: gameNews } = useSWR(`/api/getGameNews/${appid}`, fetcher);
    const { data: gamePosts } = useSWR(`/api/getGame/${appid}`, fetcher);

    //Fetch userContext
    const {userInfo} = useContext(Context); 
    const[steamid, setSteamid] = useState(null);
    const[username, setUsername] = useState(null);

    useEffect(() => {
        if(userInfo && !steamid){
        initFields();
        }
    },[userInfo]);
    
    const initFields = () => {
        setSteamid(userInfo.steamid);
        setUsername(userInfo.personaname);
    };

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
        <Head>
          <title>GamesGram Game News</title>
          <link rel="icon" href="/images/GPic.jpg" />
        </Head>
        <div className={styles.main}>
            <div className={styles.one}>
                <Sidebar selection={SidebarSelect}/>
            </div>
            <div className={styles.two}>
                {gameNews&&<News news={gameNews[0]}/>}
              {gamePosts ? gamePosts.map((gamePost) => <HomeWall key={gamePost.filenam} id={gamePost.filenam} media={gamePost} />) : <p>Here will be our Game page by default</p>}
            </div>
            <div className={styles.three}>
                {username ? <ChatBox appid={appid} userName={username} steamid={steamid}/> :null}
            </div>
        </div>
    </main>
)
}

//possiblity with get static path etc
// <ChatBox appid={appid} userName={username} steamid={steamid}/>
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