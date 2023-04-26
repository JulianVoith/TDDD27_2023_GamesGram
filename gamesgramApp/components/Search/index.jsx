import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import { DebounceInput } from 'react-debounce-input';
import cx from 'classnames';
import styles from '@/styles/Search.module.css';
import {Button,Modal,Form} from 'react-bootstrap';
import SearchBar from './SearchBar';
import {GetUserInfo} from '@/components/Tools/getUserInfo'
import Link from 'next/link';

export default function Search(){
    const [searchResults, setSearchResults] = useState([]);

    const handlesearchResults = useCallback(
        (searchResults) => {
          // get searchResults from searchBar
          setSearchResults(searchResults);
        },
        [searchResults]
    );
    //console.log(searchResults);
    return(
        <>
        <SearchBar onSearch = {handlesearchResults}/>
        {searchResults.length !== 0 && (
            <div className={styles.resultsContainer}>
              {searchResults.map((result) => (
                <UserCard key={result} steamid = {result} />
              ))}
            </div>
          )}
        </>
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