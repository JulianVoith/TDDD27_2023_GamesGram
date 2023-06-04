import styles from "@/styles/Sidebar.module.css";
import cx from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import Context from "@/context/Context";
import { useRouter } from "next/router";

//Component for the platforms sidebar
export default function Sidebar(props) {
  //Hooks for css states of each sidebar component
  const { userInfo, setuserInfo } = useContext(Context);
  const [steamid, setSteamid] = useState();
  const [avatar, setAvatar] = useState();

  //react router variable
  const router = useRouter();

  //Effect to make sure data hooks are not empty
  useEffect(() => {
    if (userInfo && !steamid) {
      initFields();
    }
  }, [userInfo]);

  const initFields = () => {
    setSteamid(userInfo.steamid);
    setAvatar(userInfo.avatar);
  };

  //Icon header of the sidebar
  const Header = () => {
    return (
      <Link
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
        href="/"
      >
        <Image
          src={"/images/Gpic.jpg"}
          height={60}
          width={60}
          alt="GGramLogo"
          className="rounded-circle"
        />
        <h1>amesGram</h1>
      </Link>
    );
  };

  //Function for user signout. Deletes local storage and token from database
  const handleSignout = async () => {
    const endpoint = "/api/SignOut";
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        token: window.localStorage.getItem("token"),
      },
    };
    const response = await fetch(endpoint, options);

    if (response.status === 200) {
      localStorage.clear();
      window.localStorage.clear();
    }
    if (typeof window !== "undefined") {
      //In case location is on root url
      if (router.route === "/"){
        router.reload();
      }else {
        router.push('/');
      }
      
    }
  };

  //Function for hovering functionality of navigation bar
  const NavigationBar = () => {
    //hover over sidebar event changes background color
    function mouseOver(e) {
      e.target.style.background = "#06377e";
    }
    //once hover has ended, background color changes
    function hoverLeave(e) {
      e.target.style.background = "";
    }

    return (
      <div>
        <ul role="button" className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link
              href="/"
              id="Home"
              className={props.selection.home}
              onMouseOver={mouseOver}
              onMouseLeave={hoverLeave}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/Search"
              id="Search"
              className={props.selection.search}
              onMouseOver={mouseOver}
              onMouseLeave={hoverLeave}
            >
              Search
            </Link>
          </li>
          <li>
            <a
              id="Reels"
              className={props.selection.reels}
              onMouseOver={mouseOver}
              onMouseLeave={hoverLeave}
            >
              Galaries/Reels
            </a>
          </li>
          <li>
            <Link
              href={`/teamMates/?steamid=${steamid}`}
              as={"/teamMates"}
              id="TeamMates"
              className={props.selection.teamMates}
              onMouseOver={mouseOver}
              onMouseLeave={hoverLeave}
            >
              TeamMates
            </Link>
          </li>
          <li>
            <Link
              href={`/${steamid}`}
              as={`/${steamid}`}
              id="Profile"
              className={props.selection.profile}
              onMouseOver={mouseOver}
              onMouseLeave={hoverLeave}
            >
              {avatar ? (
                <Image
                  src={avatar}
                  width={20}
                  height={20}
                  alt={steamid}
                  className={styles.avatar}
                />
              ) : null}
              Profile
            </Link>
            <hr />
            <a
              id="Signout"
              className={props.selection.signout}
              onClick={handleSignout}
              onMouseOver={mouseOver}
              onMouseLeave={hoverLeave}
            >
              SignOut
            </a>
          </li>
        </ul>
      </div>
    );
  };

  //return of the sidebar
  return (
    <>
      <div
        className={cx(
          styles.main,
          "d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
        )}
      >
        <Header />
        <hr />
        <NavigationBar />
      </div>
    </>
  );
}
