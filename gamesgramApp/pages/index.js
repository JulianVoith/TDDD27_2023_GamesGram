import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import LoginForm from '@/pages/LoginAndSignUp/login-gamesgram';
import Image from 'next/image';
import Sidebar from '@/components/Siderbar';



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

    const LoginIcon = () => (
        <Image
          src="/images/logo.png" // Route of the image file
          height={144} // Desired size with correct aspect ratio
          width={144} // Desired size with correct aspect ratio
          alt="Logo"
        />
      );
    return(
        <div>
            <Head>
                <title>Login to GamesGram</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main>
                <Sidebar></Sidebar>
                <div className={styles.container}>
                    <Image
                        src="/images/logo.png" // Route of the image file
                        height={256} // Desired size with correct aspect ratio
                        width={256} // Desired size with correct aspect ratio
                        alt="Logo"
                        />
                    <LoginForm/>
                    </div>
                
            </main>
        </div>
    )

}
