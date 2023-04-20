import { useState, useEffect } from 'react';
import Sidebar from '@/components/Siderbar';

export default function HomeMain(){
    const [page, setPage] = useState(null);


    const handleNavigation = (nav) => {
        setPage(nav)
        console.log(nav);
    }

    return (
        <Sidebar navigate={handleNavigation}/>
    )
}