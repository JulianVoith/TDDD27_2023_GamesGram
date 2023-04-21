import { useState, useEffect } from 'react';
import Sidebar from '@/components/Siderbar';

export default function HomeMain(userInfo){
    const [page, setPage] = useState(null);
    userInfo = userInfo.userInfo;
    console.log("home",userInfo)
    console.log(userInfo.avatar)
    
    const handleNavigation = (nav) => {
        setPage(nav)
        console.log(nav);
    }

    return (
        <>
        <Sidebar navigate={handleNavigation} userInfo={userInfo}/>
        <h1>{page}</h1>
        </>
    )
}