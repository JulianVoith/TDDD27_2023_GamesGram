import { useEffect, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import styles from '@/styles/Search.module.css';
import {GetUserInfo} from '@/components/Tools/getUserInfo'
import Image from 'next/image';
import Link from 'next/link';

export function SearchBar(props){
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        if (typeof searchTerm !== '') {
          const endpoint =`/api/search/${searchTerm}`;
          const options = {
            // The method is POST because we are sending data.
            method: 'GET',
            // Tell the server we're sending JSON.
            headers: {
              'Content-Type': 'application/json',
            },};
          const response = await fetch(endpoint, options);
          if(response.status===200)
          {
            const data = await response.json();
            setSearchResults(data[0]);
          }
        } else {
          //setSearchResults([]);
        }
      };
  
      fetchData();
    }, [searchTerm]);

    useEffect(()=>{
      props.onSearch(searchResults);
    },[searchResults]);
    
    return (
        <div className={styles.searchContainer}>
          <DebounceInput
            minLength={2}
            debounceTimeout={300}
            type="text"
            placeholder="Search..."
            className={styles.searchInput}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      );
}

export function UserCard(props){
  const [usersInfo, setUsersInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if(props.steamid)
      {const data = await GetUserInfo(props.steamid);
      setUsersInfo(data);
  }
    };

    fetchUserInfo();
  }, [props.steamid]);
  
  // Render the component
  return (
    <div className={styles.resultItem}>
      {usersInfo !==null ? 
          usersInfo.map((userInfo)=><Card key={userInfo.steamid} userInfo={userInfo}/>)
       : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export function Card(props){
  const userInfo = props.userInfo;
  return(
          <>
          <h1>{userInfo.personaname}</h1>
          <Link href={`/${userInfo.steamid}`} shallow={true} >
          <Image 
          src={userInfo.avatarfull} 
          width={100}
          height={100}
          alt={`${userInfo.personaname}'s avatar`}
          />
          </Link>
        </>
  );
}