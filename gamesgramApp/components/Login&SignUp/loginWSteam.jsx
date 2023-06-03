import styles from '@/styles/Login.module.css';
import Image from 'next/image';
import Link from 'next/link';
import cx from 'classnames';

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

  const Header = () => {
    return (
      <>
        <Link className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none" href="/">
          
          <div className="container">
            <Image 
            src={"/images/Gpic.jpg"} 
            height={60} 
            width={60} 
            alt="GGramLogo"
            className ="rounded-circle"
              />
            <h1> Welcome to GamesGram </h1>
            <h2>Please login with your Steam account</h2>
          </div>
        </Link>
      </>
    );
  };

    return (
        <>
        <main className={cx(styles.main,"text-center bg-dark")}>
            <div><Header /></div>
            <div><LoginWSteamL  /></div>
        </main>
        </>
    )
}