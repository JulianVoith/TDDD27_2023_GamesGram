import { useEffect, useState,useContext } from 'react';
import Context from "@/context/Context";
import {Button} from 'react-bootstrap';

//Component for following fucntionality 
export default function Follow(props){
    const { userInfo } = useContext(Context);
    //Followed  -> True means has followed, False means has not followed
    const [Followed, updateFollowed] = useState(undefined);
    
    //Method to check if logged in user follows a specific user. needs optimization
    const checkAndSetFollowed = () => {
      const followers = props.follower;
      updateFollowed(false);
      if (followers) {
        for (let follower of followers) {
          if (follower.steamid === (userInfo.steamid)) {
            updateFollowed(true);
            break;
          }
        }
      }
    };
    //on load check if user has already been followed by logged-in follower. adjust button depending on state
    useEffect(() => {
      if (Followed === undefined) {
        checkAndSetFollowed();
      }
    }, [props.userInfo.steamid]);

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
          ? <Button className="btn btn-outline-primary" onClick={unFollow}>Unfollow</Button>
          : <Button className="btn btn-primary" onClick={setFollow}>Follow</Button>}
      </>
    );
}