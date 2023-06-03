import { useEffect, useState } from 'react';
import {Button} from 'react-bootstrap';

//Component for following fucntionality 
export default function  Follow(props){

    //Followed  -> True means has followed, False means has not followed
    const [Followed, updateFollowed] = useState(undefined);

    
    //on load check if user has already been followed by logged-in follower. adjust button depending on state
    useEffect(() => {
      const checkAndSetFollowed = async () => {
        const followers = await checkFollowed();
        if (followers) {
          for (let i = 0; i < followers.length; i++) {
            let match = followers[i][0].match(/\((\d+),\)/);
            let number = match ? match[1] : null;
            if (number === (props.userInfo.steamid)) {
              updateFollowed(true);
              return;
            }
          }
        }
        updateFollowed(false);
      };
  
      if (Followed === undefined) {
        checkAndSetFollowed();
      }
    }, [props.userInfo.steamid]);

    //Function to cheack follow data base
    const checkFollowed = async() => {
        const endpoint = `/api/getFollowers/${window.localStorage.getItem("steamid")}`;
          const options = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'token': window.localStorage.getItem("token"),
            },
          };
          const response = await fetch(endpoint, options);
          const data = await response.json();
          return data;
    }

    //Function to follow a user
    const setFollow = async() => {
        const endpoint = `/api/follow/${props.userInfo.steamid}`;
          const options = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'token': window.localStorage.getItem("token"),
            },
          };
          const response = await fetch(endpoint, options);
          if(response.status===201){
            updateFollowed(true);
          }
    }

    //Function to unfollow
    const unFollow = async() => {
        const endpoint = `/api/follow/${props.userInfo.steamid}`;
          const options = {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'token': window.localStorage.getItem("token"),
            },
          };
          const response = await fetch(endpoint, options);
          if(response.status===200){
            updateFollowed(false);
          }
    }

    
    return (
      <>
      {Followed 
          ? <Button variant="primary" onClick={unFollow}>Unfollow</Button>
          : <Button variant="primary" onClick={setFollow}>Follow</Button>}
      </>
    );
}