import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import LoginForm from '@/components/Login&SignUp/loginForm';
import HomeMain from '@/components/Home';
import LoginWSteam from '@/components/Login&SignUp/loginWSteam';
import Image from 'next/image';
import Auth from '@/components/Login&SignUp/AuthButton';
import { useRouter } from 'next/router';

export default function Home(){
    const [token, setToken] = useState(null);
    const [userInfo,setuserInfo] = useState(null);
    const router = useRouter()

  useEffect(() => {
    // Check if it is running in a browser environment
    if (typeof window !== "undefined") {
      // Find the value with token as key in localStorage
      setToken (window.localStorage.getItem("token"));
    }
  }, []);

  const GetuserInfo = async()=>{
    if(!userInfo&&token!==null){
        const JSONdata = JSON.stringify({'token':token})
        
            // API endpoint where we send form data.
            const endpoint = '/api/GetUserInfo'
        
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
            }
        
            // Send the form data to our forms API on Vercel and get a response.
            const response = await fetch(endpoint, options)
            const data = await response.json();
            setuserInfo(data.response.players[0])
    }
}
  useEffect(()=>{
    GetuserInfo()
    },[token]);

    const handleLogin = (token) => {
        console.log(`Logged in with token ${token}`);
        setToken(token);
        if (typeof window !== 'undefined')
        {
            localStorage.setItem("token",token);
            console.log("JUMP")
            router.push("/");
        }
      };

     const Post =async()=>{//should work as an onEvent function?
        
        if(Object.keys(router.query).length!==0&&token===null)
        {
            const JSONdata = JSON.stringify(router.query)
        
            // API endpoint where we send form data.
            const endpoint = '/processSteamLogin'
        
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
            }
        
            // Send the form data to our forms API on Vercel and get a response.
            const response = await fetch(endpoint, options)
            
            const data = await response.json();
            handleLogin(data.token)

        }

    }
    Post()
    return(
        <div>
            <Head>
                {!token ? <title>Welcome to GamesGram</title>: <title>GamesGram</title>}
                
                <link rel="icon" href="/images/GPic.jpg"/>
            </Head>
            <main >
                {!token||!userInfo ? <LoginWSteam />: <HomeMain userInfo={userInfo}/>}
            </main>
        </div>
    )

}