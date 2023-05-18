import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import {Button,Modal,Form, Container, Row} from 'react-bootstrap';
import Context from '@/context/Context';

//TODO: Implementation of follow
export default function  Follow(props){
    //different display depending on profile
    //your own profile? maybe disapear
    //others depending on follow or not follow. possibility to unfollow

    //TODO: Implementation of follow
    //check if has followed


    //Followed  -> True means has followed, False means has not followed
    const [Followed, updateFollowed] = useState(undefined);

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

    const unFollow = async() => {
        const endpoint = `/api/unfollow/${props.userInfo.steamid}`;
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