import { useRouter } from 'next/router';

import { useEffect, useState } from 'react';
import {GetUserInfo} from '@/components/Tools/getUserInfo'
import {GetUserMedia} from '@/components/Tools/getUsermedia'
import Sidebar from '@/components/Siderbar';
import Profile from '@/components/Profile';
import styles from '@/styles/Home.module.css';
import PostWall from '@/components/PostWall';
import Post from '@/components/Post';
import { Modal } from 'react-bootstrap';


//Modal.setAppElement('#__next');

const UserProfile = ({ dataUserInfo, posts }) => { //userData 
  const [userInfo,setUserInfo] = useState(dataUserInfo); //null
  const [myInfo,setMyInfo] = useState(null); //null
  const [mediaPosts,setMediaPosts] = useState(posts); //nul
  const router = useRouter();
  const { steamid, postID } = router.query;

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
/*
  //fetch inspected user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userInfo === null&&steamid) {
        const data = await GetUserInfo(steamid);
        if (data) {
          setUserInfo(data[0]);
        }
      }
    };
  
    fetchUserInfo();
  }, [steamid, userInfo]);

  //fetch posted media for inspected or logged-in user by steamid
  useEffect(() => {
      const fetchPostData = async () =>{
        if(mediaPosts === null && steamid){
          const posts = await GetUserMedia(steamid);
          if(posts){
            setMediaPosts(posts);
          }
        }
      };

      fetchPostData();
  }, [mediaPosts]); */

  console.log(router.query);

  return (
    <main>
     <div>
      <Modal
        show={!!router.query.postID}
        //onRequestClose={() => router.push(`/${userinfo[0].steamid}`, undefined, { scroll: false })}
        //contentLabel="Post modal"
      >
      <Modal.Body>
        <Post id={router.query.postID} pathname={router.pathname} />
      </Modal.Body>
      </Modal>
    </div> 

    <div className={styles.main}>
      {myInfo &&  <div className={styles.one}><Sidebar selection={SidebarSelect} userInfo={myInfo}/></div>}
      {userInfo ? <Profile userInfo={userInfo} media={mediaPosts} />:404}
    </div>
    <div>
      {mediaPosts&&userInfo ? <PostWall userInfo={userInfo} media={mediaPosts} />: "No posts available"}:
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


  /*dataMyInfo = await GetUserInfo();
  dataUserInfo = await GetUserInfo(params.steamid);
  posts = await GetUserMedia(params.steamid);*/
  //const resMyInfo
  const resuserInfo = await fetch(`http://127.0.0.1:5000/GetUserInfo/${params.steamid}`);
  const resposts = await fetch(`http://127.0.0.1:5000/getPosts/${params.steamid}`);

  const dataUserInfoJ = await resuserInfo.json();
  const posts = await resposts.json();

  const dataUserInfo = dataUserInfoJ.response.players;
  

  return {
    props: {
      dataUserInfo: dataUserInfo,
      posts: posts
    }
  };
}


//optimizing with server props TODO?