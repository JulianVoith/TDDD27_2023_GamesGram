import styles from '@/styles/Login.module.css';
import Image from 'next/image';
import Link from 'next/link';

//Component for log-in page
//TODO: MAYBE SOME BASIC CSS
export default function LoginWSteam(){

    //Image for login button
    const imgURL = 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/steamworks_docs/english/sits_large_border.png';

    //Link variable for authentification
    const LoginWSteamL = () => (
      <>
        <Link 
        href='/authWSteam2'
        >
          <Image
          src= {imgURL}
          height={43} 
          width={114} 
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