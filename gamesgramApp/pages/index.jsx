import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import LoginForm from '@/components/Login&SignUp/loginForm';
import HomeMain from '@/components/Home';
import Image from 'next/image';
import Auth from '@/components/Login&SignUp/AuthButton';


/*export function TestApi() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/hello/')
            .then(res => res.json())
            .then(data => {
                setMessage(data.message);
                setLoading(false);
            })
    }, [])

    return (
        <div className={styles.container}>
            <p> {!loading ? message : "Loading.."}</p>
        </div>
    )
}*/



export default function Home(){
    const [token, setToken] = useState(null);
    const [signUp, setSignUp] = useState(false);

    const handleLogin = (token) => {
        console.log(`Logged in with token ${token}`);
        setToken(token);
      };

    return(
        <div>
            <Head>
                <title>Login to GamesGram</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main >
                {!token ? <LoginForm onLogin={handleLogin} />: <HomeMain/>}
            </main>
        </div>
    )

}
