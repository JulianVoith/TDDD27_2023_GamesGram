import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import Head from "next/head";
import Sidebar from "@/components/Siderbar";
import Profile from "@/components/Profile";
import styles from "@/styles/Home.module.css";
import PostWall from "@/components/PostWall";
import Post from "@/components/Post";
import { Modal } from "react-bootstrap";

//MODAL FOR STEAM FRIENDS?????
//TODO change mediapost layout

const UserProfile = ({
  dataUserInfo,
  userFollower,
  userFriends,
  userPosts,
  steamid,
}) => {
  //Data hooks for user profile information
  const [userViewInfo, setUserInfo] = useState(dataUserInfo); //Information about inspected user
  const [follower, setFollower] = useState(userFollower); //Follower of inspected user
  const [friends, setFriends] = useState(userFriends); //Firends of inspected user
  const [mediaPosts, setMediaPosts] = useState(userPosts); //Posts of inspected user
  const [isReload, setReload] = useState(false); //Reload hook for profile information

  console.log("steamid", steamid);
  //React router variable
  const router = useRouter();

  const handleReload = (data) => {
    setReload(data);
  };

  //fetching post from server
  const fetchPost = async () => {
    const resposts = await fetch(`http://127.0.0.1:5001/getPosts/${steamid}`);
    const posts = await resposts.json();
    setMediaPosts(posts);
  };

  //Use effect for reloading post
  useEffect(() => {
    if (isReload) {
      setReload(false);
      fetchPost();
    }
  }, [isReload]);

  //Constant for the sidebar selection highlight which is passed as a prop to child components
  const SidebarSelect = {
    home: "nav-link text-white",
    search: "nav-link text-white",
    reels: "nav-link text-white",
    teamMates: "nav-link text-white",
    profile: "nav-link active",
    signout: "nav-link text-white",
  };
  return (
    <main>
      <Head>
        <title>GamesGram Profile</title>
        <link rel="icon" href="/images/GPic.jpg" />
      </Head>
      <div>
        <Modal
          show={!!router.query.postID}
          size="lg"
          onHide={() =>
            router.push(`/${userViewInfo[0].steamid}`, undefined, {
              scroll: false,
            })
          }
        >
          <Modal.Header>Details</Modal.Header>
          <Modal.Body>
            <Post
              postID={router.query.postID}
              descr={router.query.descr}
              urlPost={router.query.urlPost}
              pathname={router.pathname}
            />
          </Modal.Body>
        </Modal>
      </div>

      <div className={styles.main}>
        <div className={styles.one}>
          <Sidebar selection={SidebarSelect} />
        </div>
        <div>
          <Profile
            userInfo={userViewInfo[0]}
            follower={follower}
            friends={friends}
            handleReload={handleReload}
          />
        </div>
        <div className={styles.two}>
          {mediaPosts && userViewInfo ? (
            <PostWall userInfo={userViewInfo[0]} media={mediaPosts} />
          ) : (
            "No posts available"
          )}
          :
        </div>
      </div>
    </main>
  );
};

export default UserProfile;

//Server side prerendering of all profile routes (existing database users)
//In case friends are getting inspected which do not have a profile, it will be generated (fallback:blocking)
export async function getStaticPaths() {
  const res = await fetch("http://127.0.0.1:5001/getUsers");
  const users = await res.json();

  const paths = users.map((steamid) => ({
    params: { steamid: steamid.toString() },
  }));

  return { paths, fallback: "blocking" };
}

//Generating props for profile. Includes use information (posts, follower, and friends)
export async function getStaticProps({ params }) {
  //Fetching data from server
  const resuserInfo = await fetch(
    `http://127.0.0.1:5001/GetUserInfo/${params.steamid}`
  );
  const resposts = await fetch(
    `http://127.0.0.1:5001/getPosts/${params.steamid}`
  );
  const refollows = await fetch(
    `http://127.0.0.1:5001/getFollowers/${params.steamid}`
  );
  const refriends = await fetch(
    `http://127.0.0.1:5001/GetFriendList/${params.steamid}`
  );

  //Generate variables from response JSON
  const dataUserInfoJ = await resuserInfo.json();
  const posts = await resposts.json();
  const follower = await refollows.json();
  const friends = await refriends.json();
  const dataUserInfo = dataUserInfoJ.response.players;

  return {
    props: {
      key: params.steamid,
      dataUserInfo: dataUserInfo,
      userFollower: follower,
      userFriends: friends,
      userPosts: posts,
      steamid: params.steamid,
    },
  };
}
