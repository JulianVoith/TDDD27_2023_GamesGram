import { useRouter } from 'next/router';
import Sidebar from '@/components/Siderbar';
import Head from 'next/head';
import styles from '@/styles/TeamMates.module.css';
import RecentGame from '@/components/Profile/recentGame';

import { useEffect, useState } from 'react';

//Page for GameNews and chat
const TeamMates = ({  }) => { 

    //Data Hooks for recent game in order to fetch them (notused but but necessary to reuse component )
    const [Game, setGame] = useState(null);

    //react router variable
    const router = useRouter();

    //fetching steamid from url
    const steamid = router.query.steamid;

    //Constant for the sidebar selection highlight which is passed as a prop to child components
    const SidebarSelect = 
        {home: "nav-link text-white",
        search: "nav-link text-white",
        reels: "nav-link text-white",
        teamMates: "nav-link active",
        profile: "nav-link text-white",
        signout: "nav-link text-white"};

    //Function to pass game information from RecentGame component to this component
    const handleGameSet = (newState) => {
        if (newState) {  // Only update if newState is not null
            setGame(newState);
        }
    };

return (
    <>
    <div className={styles.main}>
        <Head>
          <title>GamesGram GameNews</title>
          <link rel="icon" href="/images/GPic.jpg" />
        </Head>
        <div className={styles.one}><Sidebar selection={SidebarSelect}/></div>
        <div className={styles.two}>{<RecentGame onGameSet={handleGameSet}  steamid={steamid}/>}</div>
    </div>
    </>   
)

}

export default TeamMates;

