import { useState, useEffect } from 'react';
import Sidebar from '@/components/Siderbar';
import Profile from '@/components/Profile';
import Search from '@/components/Search';
import styles from '@/styles/Home.module.css';


export default function HomeMain(userInfo){
    //Hook for page rendering, Standard value is Home
    const [page, setPage] = useState("home");

    userInfo = userInfo.userInfo;
    //console.log("home",userInfo)
    console.log(userInfo);
    
    //Function is being called when interacting with navigation bar
    //sets page hook depending in selection and executes rendering of component
    const handleNavigation = (nav) => {
        setPage(nav);
    }

    //Helper function to change rendering
    function RenderNavigatedPage(){
        if(page == "home"){
            
        }else if(page == "search"){
            return <Search classname=""/>;
        }else if(page == "reels"){
            
        }else if(page == "teamMates"){
            
        }else{
            return <Profile classname="" userInfo={userInfo} />;
        }
        
    }

    return (
        <>
        <main>
            <div className={styles.main}>
                <div className={styles.one}><Sidebar navigate={handleNavigation} userInfo={userInfo}/></div>
                <div className={styles.two}><RenderNavigatedPage /></div>
            </div>
        </main>
        </>
    )
}