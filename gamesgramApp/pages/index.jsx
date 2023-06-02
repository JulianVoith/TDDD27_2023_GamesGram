import styles from '../styles/Home.module.css';
import { useEffect, useState, useContext } from 'react';
import Head from 'next/head';
import Sidebar from '@/components/Siderbar';
import LoginWSteam from '@/components/Login&SignUp/loginWSteam';
import HomeWall from '@/components/HomeWall';
import { useRouter } from 'next/router';
import Context from '@/context/Context';


//Start page of GamesGram app
export default function Home() {

  //VERCEL probides useSession??

  //Hooks for data handling (token, user, posts)
  const [hastoken, setToken] = useState(false);          //Hook for generated token
  const { userInfo, setuserInfo } = useContext(Context); //Hook for feteched usert information
  const router = useRouter()                             //Router for variable for dynamic routing
  const [mediaPosts, setMediaPosts] = useState(null);    //Hook for Posts
  //On mount of index page check if token is (Signed in) in local storage
  //Forward to home page of the platform
  useEffect(() => {
    // Check if it is running in a browser environment
    if (typeof window !== "undefined") {
      //Check token in local storage and set token hook
      if (window.localStorage.getItem("token")) {
        setToken(true);
      }
      else {
        setToken(false);
      }
    }
  }, []);

//Method: Fetch posts from server and store in state mediaPosts
  const GetPost = async () => {
    try {
      if (window.localStorage.getItem("token") && userInfo) {
        // API endpoint where we send form data.
        const endpoint = `/api/getHome/${userInfo.steamid}`

        // Form the request for sending data to the server.
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'token': window.localStorage.getItem("token"),
          },
        }
        const response = await fetch(endpoint, options)
        const data = await response.json();
        setMediaPosts(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  //TODO:replace with swr and user hook
  const GetuserInfo = async () => {

    if (!userInfo && window.localStorage.getItem("token")) {

      // API endpoint where we send form data.
      const endpoint = '/api/GetUserInfo'
      // Form the request for sending data to the server.
      const options = {
        method: 'GET',
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
  useEffect(() => {GetuserInfo();}, [hastoken]);

//Method: If authentification with steam servers were successful, token will be set and main page is called
  const handleLogin = (token) => {
    if (typeof window !== 'undefined' && typeof token !== 'undefined') {
      localStorage.setItem("token", token);
      setToken(true);
      router.push("/");
    }
  };

  // Send the information to server once reciverd steam server information
  // and handleLogin
  useEffect(() => {postData();}, [router.query]);
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


  //Constant for the sidebar selection highlight which is passed as a prop to child components
  const SidebarSelect =
  {
    home: "nav-link active",
    search: "nav-link text-white",
    reels: "nav-link text-white",
    teamMates: "nav-link text-white",
    profile: "nav-link text-white",
    signout: "nav-link text-white"
  };

  //TODO: replace with swr
  //set HomePost
  useEffect(() => {
    //Now the post only fetch once, it should be a onlisten event 
    //TODO: add onlisten event depend on Websocket
    if (!mediaPosts) { GetPost();}}, [userInfo]);


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
              {mediaPosts ? mediaPosts.map((mediaPost) => <HomeWall key={mediaPost.filenam} id={mediaPost.filenam} media={mediaPost} />) : <p>Here will be our home page by default</p>}
            </div>
          </div>
        }
      </main>
    </div>
  )
}
