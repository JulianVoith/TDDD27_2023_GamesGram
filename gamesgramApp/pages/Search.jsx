
import Sidebar from '@/components/Siderbar';
import { useEffect, useState, useCallback,useContext } from 'react';
import styles from '@/styles/Search.module.css';
import {SearchBar,UserCard,Card} from '@/components/Search';

export default function Search(){

    const [searchResults, setSearchResults] = useState([]);
    const handlesearchResults = useCallback(
        (searchResults) => {
          // get searchResults from searchBar
          setSearchResults(searchResults);
        },
        [searchResults]
    );
    
    //constant for the sidebar selection css which is passed as a prop
    const SidebarSelect = 
                          {home: "nav-link text-white",
                          search: "nav-link active",
                          reels: "nav-link text-white",
                          teamMates: "nav-link text-white",
                          profile: "nav-link text-white",
                          signout: "nav-link text-white"};

    return(
      <div className={styles.main}>
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

