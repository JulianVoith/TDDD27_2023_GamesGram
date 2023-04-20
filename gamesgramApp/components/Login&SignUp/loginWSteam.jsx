import styles from '@/styles/Login.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';




export default function LoginWSteam(){
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const LoginWSteamL = () => (
      <>
        <Image
          src="/images/steam_logo.png" // Route of the image file
          height={60} // Desired size with correct aspect ratio
          width={60} // Desired size with correct aspect ratio
          alt="LogoSteam"
          onClick={handleSteamRedirect}
        />
        <Link 
        href='/authWSteam2'
        >STEAM</Link>
        </>
      );
    
    const handleSteamRedirect = async (event) => {
        const req = await fetch('/authWSteam2');
      //  const newData = await req.json();
    }

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