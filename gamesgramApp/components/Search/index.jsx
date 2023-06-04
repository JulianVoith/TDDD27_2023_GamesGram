import { useEffect, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import styles from '@/styles/Search.module.css';

//Main component of the search page (searchbar)
export default function SearchBar(props){

  //Data hooks for user search
    const [searchTerm, setSearchTerm] = useState('');       //Hook for modifying the search bar
    const [searchResults, setSearchResults] = useState([]); //Hook to display the results of the search
  
    //Effect to read database when typing into searchbar to provide suggestions
    useEffect(() => {
      const fetchData = async () => {
        if (typeof searchTerm !== '') {
          const endpoint =`/api/search/${searchTerm}`;
          const options = {
            method: 'GET',
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
    
    //Effect to propagate back the searchresult to the father search page 
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