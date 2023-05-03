import styles from '@/styles/Sidebar.module.css'
import cx from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect,useContext } from 'react';
import Context from '@/context/Context';

export default function Sidebar(props){
//Hooks for css states of each sidebar component
  const[cssStates, setState] = useState({
    home: "nav-link active",
    search: "nav-link text-white",
    reels: "nav-link text-white",
    teamMates: "nav-link text-white",
    profile: "nav-link text-white",
    signout: "nav-link text-white",
  });

  //Fetch userContext
  const {userInfo} = useContext(Context); 

  //console.log(props);
  

//const for header of side bar
  const Header = () => {
      return (
        <Link className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none" href="/">
          <Image 
            src={"/images/Gpic.jpg"} 
            height={60} // Desired size with correct aspect ratio
            width={60} // Desired size with correct aspect ratio
            alt="GGramLogo"
            className ="rounded-circle"
            />
          <h1>amesGram</h1>
        </Link>
      );
    };
    const handleSignout = async ()=>{
      const endpoint = '/api/SignOut'
        
            // Form the request for sending data to the server.
            const options = {
                // The method is POST because we are sending data.#
                method: 'DELETE',
                // Tell the server we're sending JSON.
                headers: {
                'Content-Type': 'application/json',
                'token':window.localStorage.getItem("token"),
                },
                // Body of the request is the JSON data we created above.
            }
        
            // Send the form data to our forms API on Vercel and get a response.
            const response = await fetch(endpoint, options)
            if (response.status===200){
              localStorage.clear();
              window.localStorage.clear();
            }
            if (typeof window !== "undefined") {window.location.reload()}
    }

//const for navigation bar and events
    const NavigationBar = () => {

      //hover over sidebar event changes background color
      function mouseOver(e){
        e.target.style.background = '#06377e';
      }
      //once hover has ended, background color changes
      function hoverLeave(e) {
        e.target.style.background = '';
      }

      //onclick funmction which changes styling and returns the selected value back to main login page
      function onClickNavbar(item) {

        //contents of sidebar
        const items = ["home", "search", "reels", "teamMates", "profile"];

        //setting css state of sidebar elements
        setState({
          home:"nav-link text-white",
          search:"nav-link text-white",
          reels:"nav-link text-white",
          teamMates:"nav-link text-white",
          profile:"nav-link text-white",
          [items[item]]:"nav-link active"}
        );
        
        //sends back the selected value to logged-in main page

        //props.navigate(items[item]);
        return false; 
      }

      return (
        <div >
          <ul role="button" className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
              
              <Link href="/" id="Home" className={props.selection.home} onClick={() => onClickNavbar(0)} onMouseOver={mouseOver} onMouseLeave={hoverLeave}>
                Home
              </Link>
            </li>
            <li>
                <Link href="/Search" id="Search" className={props.selection.search} onClick={() => onClickNavbar(1)} onMouseOver={mouseOver} onMouseLeave={hoverLeave} >
                  Search
                </Link>
            </li>
            <li>
              <a id="Reels" className={props.selection.reels} onClick={() => onClickNavbar(2)} onMouseOver={mouseOver} onMouseLeave={hoverLeave}>
                Galaries/Reels
              </a>
            </li>
            <li>
              <a id="TeamMates" className={props.selection.teamMates}  onClick={() => onClickNavbar(3)} onMouseOver={mouseOver} onMouseLeave={hoverLeave}>
                TeamMates
              </a>
            </li>
            <li>
              <Link href={`/${userInfo.steamid}`} id="Profile" className={props.selection.profile} onClick={() => onClickNavbar(4)} onMouseOver={mouseOver} onMouseLeave={hoverLeave}>
                <Image 
                src={userInfo.avatar}
                width={20}
                height={20}
                alt={userInfo.personaname}
                className={styles.avatar}
                />
                 Profile
              </Link>
              <hr/>
              <a id="Signout" className={props.selection.signout}  onClick={handleSignout} onMouseOver={mouseOver} onMouseLeave={hoverLeave}>
                SignOut
              </a>
            </li>
          </ul>
        </div>
      );

    };

//return of the sidebar
      return (
          < >
          <div className={cx(styles.main,"d-flex flex-column flex-shrink-0 p-3 text-white bg-dark")}>
            <Header />
            <hr />
            <NavigationBar />
          </div>
          </>
      )
  }