import { useState, useEffect } from 'react';
import Sidebar from '@/components/Siderbar';
import Profile from '@/components/Profile';
import styles from '@/styles/Home.module.css';


export default function HomeMain(userInfo){
    //Hook for page rendering, Standard value is Home
    const [page, setPage] = useState("home");

    userInfo = userInfo.userInfo;
    //console.log("home",userInfo)
    //console.log(userInfo.avatar)
    
    //Function is being called when interacting with navigation bar
    //sets page hook depending in selection and executes rendering of component
    const handleNavigation = (nav) => {
        setPage(nav);
        console.log(nav);
    }

    //Helper function to change rendering
    function RenderNavigatedPage(p){
        if(p == "home"){
            
        }else if(p == "search"){

        }else if(p == "reels"){
            
        }else if(p == "teamMates"){
            
        }else{
            return <Profile classname="" userInfo={userInfo} />;
        }
        
    }

    return (
        <>
        <main>
            <div className={styles.main}>
                <div className={styles.one}><Sidebar navigate={handleNavigation} userInfo={userInfo}/></div>
                <div className={styles.two}><RenderNavigatedPage p = {page} /></div>
            </div>
        </main>
        </>
    )
}