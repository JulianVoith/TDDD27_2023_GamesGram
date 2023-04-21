import styles from '@/styles/Sidebar.module.css'
import cx from 'classnames';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Profile from '../Profile/profile';
//import { functions } from 'cypress/types/lodash';


export default function Sidebar(props){

//Hooks for css states of each sidebar component
  const[cssStates, setState] = useState({
    home: "nav-link active",
    search: "nav-link text-white",
    reels: "nav-link text-white",
    teamMates: "nav-link text-white",
    profile: "nav-link text-white"
  });

//const for header of side bar
  const Header = () => {
      return (
        <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
          <Image 
            src={"/images/Gpic.jpg"} 
            height={60} // Desired size with correct aspect ratio
            width={60} // Desired size with correct aspect ratio
            alt="GGramLogo"
            className ="rounded-circle"
            />
          <h1>amesGram</h1>
        </div>
      );
    };

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
        props.navigate(items[item]);
        return false; 
      }

      return (
        <div >
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
              <a id="Home" className={cssStates.home} onClick={() => onClickNavbar(0)} onMouseOver={mouseOver} onMouseLeave={hoverLeave}>
                Home
              </a>
            </li>#
            <li>
              <a id="Search" className={cssStates.search} onClick={() => onClickNavbar(1)} onMouseOver={mouseOver} onMouseLeave={hoverLeave} >
                Search
              </a>
            </li>
            <li>
              <a id="Reels" className={cssStates.reels} onClick={() => onClickNavbar(2)} onMouseOver={mouseOver} onMouseLeave={hoverLeave}>
                Reels
              </a>
            </li>
            <li>
              <a id="TeamMates" className={cssStates.teamMates}  onClick={() => onClickNavbar(3)} onMouseOver={mouseOver} onMouseLeave={hoverLeave}>
                TeamMates
              </a>
            </li>
            <li>
              <a id="Profile" className={cssStates.profile} onClick={() => onClickNavbar(4)} onMouseOver={mouseOver} onMouseLeave={hoverLeave}>
                <Image 
                src={props.userInfo.avatar}
                width={20}
                height={20}
                alt={props.userInfo.personaname}
                className={styles.avatar}
                />
                 Profile
              </a>
            </li>
          </ul>
        </div>
      );

    };

    //should be later on the profile display instead of list item 
    //once page is there#
    const ProfileBar = () => {
      return (
        <div className="dropdown">
          <a id="dropwdownUser" className="d-flex align-items-center link-dark text-decoration-none dropdown-toggle" 
            data-bs-toggle="dropdown" aria-expanded="false">
              <Image 
                src={"/images/Gpic.jpg"} 
                height={60} 
                width={60} 
                alt="GGramLogo"
                className ="rounded-circle"
              />
              <strong className = "text-white"> testUser </strong>
              ::after
          </a>
          <ul className = "dropdown-menu text-small shadow" aria-aria-labelledby='dropdownUser'>
            <li>
              <a class ="dropdown-item">
                Dummy 1
              </a>
            </li>
            <li>
              <a class ="dropdown-item">
                Dummy 2
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
            <hr />
          </div>
          </>
      )
  }