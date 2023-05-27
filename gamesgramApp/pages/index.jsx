import styles from '../styles/Home.module.css';
import { useEffect, useState, useContext } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Sidebar from '@/components/Siderbar';
import LoginWSteam from '@/components/Login&SignUp/loginWSteam';
import { useRouter } from 'next/router';
import Context from '@/context/Context';
//import { io } from 'socket.io-client';// import the socket
//import { createHash } from 'crypto'//Hash
import PostWall from '@/components/PostWall';
import Post from '@/components/Post';
import { GetUserInfo } from '@/components/Tools/getUserInfo'

//function sha256(content) {
//return createHash('sha256').update(content).digest('hex')
///}

//let socket

export default function Home() {
  const [hastoken, setToken] = useState(false); //Hook for generated token
  const { userInfo, setuserInfo } = useContext(Context); //Hook for feteched usert information
  const router = useRouter() //Variable for dynamic routing

  const [mediaPosts, setMediaPosts] = useState(null);

  //set token
  useEffect(() => {
    // Check if it is running in a browser environment
    if (typeof window !== "undefined") {
      // Find the value with token as key in localStorage
      if (window.localStorage.getItem("token")) {
        setToken(true);

      }
      else {
        setToken(false);
      }

    }
  }, []);



  const GetPost = async () => {
    if (window.localStorage.getItem("token") && userInfo) {
      // API endpoint where we send form data.
      const endpoint = `/api/getHome/${userInfo.steamid}`

      // Form the request for sending data to the server.
      const options = {
        // The method is POST because we are sending data.
        method: 'GET',
        // Tell the server we're sending JSON.
        headers: {
          'Content-Type': 'application/json',
          'token': window.localStorage.getItem("token"),
        },
      }
      const response = await fetch(endpoint, options)
      const data = await response.json();
      setMediaPosts(data);
    }
  }

  const GetuserInfo = async () => {

    if (!userInfo && window.localStorage.getItem("token")) {

      // API endpoint where we send form data.
      const endpoint = '/api/GetUserInfo'

      // Form the request for sending data to the server.
      const options = {
        // The method is POST because we are sending data.
        method: 'GET',
        // Tell the server we're sending JSON.
        headers: {
          'Content-Type': 'application/json',
          'token': window.localStorage.getItem("token"),
        },
      }

      // Send the form data to our forms API on Vercel and get a response.
      const response = await fetch(endpoint, options)
      const data = await response.json();
      setuserInfo(data.response.players[0]);
      window.localStorage.setItem("steamid", data.response.players[0].steamid);
      window.localStorage.setItem("avatar", data.response.players[0].avatar);
    }
  }

  useEffect(() => {
    GetuserInfo();
  }, [hastoken]);



  const handleLogin = (token) => {
    if (typeof window !== 'undefined' && typeof token !== 'undefined') {
      localStorage.setItem("token", token);
      setToken(true);
      router.push("/");
    }
  };


  useEffect(() => {
    const postData = async () => {
      if (Object.keys(router.query).length !== 0 && !hastoken) {
        const JSONdata = JSON.stringify(router.query);

        // API endpoint where we send form data.
        const endpoint = '/processSteamLogin';

        // Form the request for sending data to the server.
        const options = {
          // The method is POST because we are sending data.
          method: 'POST',
          // Tell the server we're sending JSON.
          headers: {
            'Content-Type': 'application/json',
          },
          // Body of the request is the JSON data we created above.
          body: JSONdata,
        };

        // Send the form data to our forms API on Vercel and get a response.
        const response = await fetch(endpoint, options);
        const data = await response.json();
        handleLogin(data.token);
      }
    };
    postData();

  }, [router.query]);

  //constant for the sidebar selection css which is passed as a prop
  const SidebarSelect =
  {
    home: "nav-link active",
    search: "nav-link text-white",
    reels: "nav-link text-white",
    teamMates: "nav-link text-white",
    profile: "nav-link text-white",
    signout: "nav-link text-white"
  };

  //set HomePost
  useEffect(() => {
    //Now the post only fetch once, it should be a onlisten event 
    //TODO: add onlisten event depend on Websocket
    if (!mediaPosts) {
      GetPost();
    }
  }, []);


  return (
    <div>
      <Head>
        {!hastoken ? <title>Welcome to GamesGram</title> : <title>GamesGram</title>}
        <link rel="icon" href="/images/GPic.jpg" />
      </Head>
      <main >
        {!hastoken || !userInfo ? <LoginWSteam /> :
          <div className={styles.main}>
            <div className={styles.one}><Sidebar selection={SidebarSelect} /></div>
            <div className={styles.two}>
              {mediaPosts ? mediaPosts.map((mediaPost) => <HomeWall id={mediaPost.filenam} media={mediaPost} />) : <p>Here will be our home page by default</p>}
            </div>
          </div>
        }
      </main>
    </div>
  )
}

function HomeWall(props) {
  const media = props.media
  const [posterInfo, setPosterInfo] = useState(null);

  useEffect(() => {
    if (!posterInfo) {
      fetchPosterInfo();
    }
  }, [])

  const fetchPosterInfo = async () => {
    const data = await GetUserInfo(media.steamid);

    setPosterInfo(data[0]);
  };
  return (
    <div>
      {posterInfo ?
        (
          <>
            <p>{posterInfo.personaname}</p>
            <Image src={posterInfo.avatarfull} width={50} height={50} className="rounded-circle mr-2" alt={posterInfo.personaname} />
            <p>{media.timestamp}</p>
            <Post postID={media.filenam} />
          </>
        )
        : <p>Loading</p>
      }
    </div>
  )

}