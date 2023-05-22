import { useRouter } from 'next/router';

import { useEffect, useState, useContext } from 'react';
import {GetUserInfo} from '@/components/Tools/getUserInfo'
import {GetUserMedia} from '@/components/Tools/getUsermedia'
import Sidebar from '@/components/Siderbar';
import Profile from '@/components/Profile';
import styles from '@/styles/Home.module.css';
import PostWall from '@/components/PostWall';
import Post from '@/components/Post';
import { Modal } from 'react-bootstrap';
import Context from '@/context/Context';

const UserProfile = ({ dataUserInfo, userFollower, userFriends, userPosts }) => { 
  const [userViewInfo,setUserInfo] = useState(dataUserInfo); 
  const [follower,setFollower] = useState(userFollower); 
  const [friends,setFriends] = useState(userFriends); 
  const [myInfo,setMyInfo] = useState(null);
  const [mediaPosts,setMediaPosts] = useState(userPosts); 

  const router = useRouter();
  //const { steamid, postID } = router.query;
  console.log(router);
  console.log(dataUserInfo, follower, friends, mediaPosts);
  //constant for the sidebar selection css which is passed as a prop
  const SidebarSelect = 
                        {home: "nav-link text-white",
                        search: "nav-link text-white",
                        reels: "nav-link text-white",
                        teamMates: "nav-link text-white",
                        profile: "nav-link active",
                        signout: "nav-link text-white"};

//fetch logged-in user information on login
  useEffect(() => {

    const fetchMyInfo = async () => {

      if (myInfo === null) {
        const data = await GetUserInfo();
        if (data) {
          setMyInfo(data[0]);
        }
      }
    };

    fetchMyInfo();
  }, [myInfo]);

  //change myinfo maybe at some point!! AND LAYOUT POST TODO
  return (
    <main>
     <div>
      <Modal
        show={!!router.query.postID}
        onRequestClose={() => router.push(`/${userinfo[0].steamid}`, undefined, { scroll: false })}
        //contentLabel="Post modal"
      >
      <Modal.Body>
        <Post id={router.query.postID} pathname={router.pathname} />
      </Modal.Body>
      </Modal>
    </div> 

    <div className={styles.main}>
      {myInfo &&  <div className={styles.one}><Sidebar selection={SidebarSelect} userInfo={myInfo}/></div>}
        <div><Profile userInfo={userViewInfo} follower={follower} friends={friends}/></div>
    </div>
    <div>
      {mediaPosts&&userViewInfo ? <PostWall userInfo={userViewInfo} media={mediaPosts} />: "No posts available"}:
    </div>
</main>
  );
};

export default UserProfile;

export async function getStaticPaths(){


  const res = await fetch("http://127.0.0.1:5000/getUsers");
  const users = await res.json();
 
  const paths = users.map((steamid) => ({
      params: { steamid: steamid.toString()},
  }));

  return {paths, fallback: false};
}

export async function getStaticProps( { params } ){
  

  const resuserInfo = await fetch(`http://127.0.0.1:5000/GetUserInfo/${params.steamid}`);
  const resposts = await fetch(`http://127.0.0.1:5000/getPosts/${params.steamid}`);
  const refollows = await fetch(`http://127.0.0.1:5000/getFollowers/${params.steamid}`);
  const refriends = await fetch(`http://127.0.0.1:5000/GetFriendList/${params.steamid}`);

  const dataUserInfoJ = await resuserInfo.json();
  const posts = await resposts.json();
  const follower = await refollows.json();
  const friends = await refriends.json();

  const dataUserInfo = dataUserInfoJ.response.players;
  
  return {
    props: {
      dataUserInfo: dataUserInfo,
      userFollower: follower,
      userFriends: friends,
      userPosts: posts
    }
  };
}

