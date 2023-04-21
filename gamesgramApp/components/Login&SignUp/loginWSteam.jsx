import styles from '@/styles/Login.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';




export default function LoginWSteam(){
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const imgURL = 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/steamworks_docs/english/sits_large_border.png';
    const LoginWSteamL = () => (
      <>
        
        <Link 
        href='/authWSteam2'
        >
          <Image
          src= {imgURL}// Route of the image file
          height={43} // Desired size with correct aspect ratio
          width={114} // Desired size with correct aspect ratio
          alt="LogoSteam"
          />
        </Link>
        </>
      );

    return (
        <>
        
        <main className={"text-center"}>

            <div>
                <LoginWSteamL  />
            </div>


        </main>
        </>
    )
}