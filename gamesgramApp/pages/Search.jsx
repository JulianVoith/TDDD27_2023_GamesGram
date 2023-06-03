
import Sidebar from '@/components/Siderbar';
import { useEffect, useState, useCallback, useContext } from 'react';
import styles from '@/styles/Search.module.css';
import Head from 'next/head';
import SearchBar from '@/components/Search';
import UserCard from '@/components/Search/usercard';


//Page to search user on the platform
export default function Search(){

    //Hook for preserving search results
    const [searchResults, setSearchResults] = useState([]);

    //Callback method to fetch results from child component
    const handlesearchResults = useCallback(
        (searchResults) => {
          // get searchResults from searchBar
          setSearchResults(searchResults);
        },
        [searchResults]
    );
    
    //Constant for the sidebar selection highlight which is passed as a prop to child components
    const SidebarSelect = 
                          {home: "nav-link text-white",
                          search: "nav-link active",
                          reels: "nav-link text-white",
                          teamMates: "nav-link text-white",
                          profile: "nav-link text-white",
                          signout: "nav-link text-white"};

    return(
      <div className={styles.main}>
        <Head>
          <title>GamesGram Search</title>
          <link rel="icon" href="/images/GPic.jpg" />
        </Head>
        <div className={styles.one}><Sidebar selection={SidebarSelect}/></div>
        <div className={styles.two} >
        <SearchBar onSearch = {handlesearchResults}/>
        {searchResults.length !== 0 && (
            <div className={styles.resultsContainer}>
              {searchResults.map((result) => (
                <UserCard key={result} steamid = {result} />
              ))}
            </div>
          )}
          </div>
        </div>
    );
}

