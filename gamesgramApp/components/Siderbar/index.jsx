import styles from '@/styles/Sidebar.module.css'
import cx from 'classnames';
import Image from 'next/image';
import Profile from './profile';


export default function Sidebar(props){

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

    const NavigationBar = () => {
      return (
        <div >
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
              <a id="Home" className="nav-link active" onClick={() => onClickNavbar(0)}>
                Home
              </a>
            </li>
            <li>
              <a id="Search" className="nav-link text-white" onClick={() => onClickNavbar(1)}>
                Search
              </a>
            </li>
            <li>
              <a id="Reels" className="nav-link text-white" onClick={() => onClickNavbar(2)}>
                Reels
              </a>
            </li>
            <li>
              <a id="TeamMates" className="nav-link text-white" onClick={() => onClickNavbar(3)} >
                TeamMates
              </a>
            </li>
            <li>
              <a id="Profile" className="nav-link text-white" onClick={() => onClickNavbar(4)}>
                Profile
              </a>
            </li>
          </ul>
        </div>
      );

    };

    const onClickNavbar = (item) => {

      let navbarItem;
      const items = ["Home", "Search", "Reels", "TeamMates", "Profile"];


      for (let i = 0; i < items.length; ++i){
        navbarItem = document.getElementById(items[i]);
        navbarItem.className = "nav-link text-white";

        if (i == item){
          navbarItem.className = "nav-link active";
        }
      }

    }

    //check how to pass item to index
    const onChanges = (item) => {
      props.navigate(item);
    }

    //should be later on the profile display instead of list item 
    //once page is there
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