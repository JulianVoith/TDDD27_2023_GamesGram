import Image from 'next/image';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Context from '@/context/Context';
import Follow from './Follow';
import RecentGame from "./recentGame";
import CreatePost from "./createPost";

//Component for the profile header which is ng informatione like follower etc.
export default function profile(props) {

    //react router variable
    const router = useRouter()

    //Data Hooks for user context, logged in user and recent games
    const { userInfo } = useContext(Context);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [Game, setGame] = useState(null);


    //TODO:small adjustment as link!
    const routeToSteam_friends = () => {
        router.push({
            pathname: '/steam_friends',
        });
    };

    //TODO: change by useUser hook
    useEffect(() => {
        if (userInfo && !loggedInUser) {
            initFields();
        }
    }, [userInfo]);

    //get the game state from children component => resentGame
    const handleGameSet = (newState) => {
        if (newState) {  // Only update if newState is not null
            setGame(newState);
        }
    };

    const initFields = () => {
        setLoggedInUser(userInfo.steamid);
    };


    return (

        <div >
            <div className="container bootstrap-snippet header-container">
                <div className="bg-white">
                    <div className="container py-5">
                        <div className="media row p-0 my-4 mx-auto">
                            <div className="col">
                                <Image
                                    src={props.userInfo.avatarfull}
                                    width={250}
                                    height={250}
                                    alt={props.userInfo.personaname}
                                    className={"rounded-circle"}
                                />
                            </div>

                            <div className="col media-body ml-5">
                                <h4 className="font-weight-bold mb-4">{props.userInfo.personaname}</h4>
                                <div className="text-muted mb-4">
                                    {props.userInfo.description}
                                </div>
                                <a href="/followers" className="d-inline-block text-dark">
                                    <strong>{props.follower.length}</strong>
                                    <span className="text-muted"> followers</span>
                                </a>
                                <br />
                                <a onClick={routeToSteam_friends} className="d-inline-block text-dark ml-3" >
                                    <strong>{props.friends["friendslist"]["friends"].length}</strong>
                                    <span className="text-muted"> Steam friends</span>
                                </a>
                            </div>
                            <br />
                            {loggedInUser ?
                                (loggedInUser !== props.userInfo.steamid ? <Follow userInfo={props.userInfo} /> : <CreatePost gameCategory={Game} />) : null}
                        </div>
                    </div>
                    <div>
                        {<RecentGame onGameSet={handleGameSet} steamid={props.userInfo.steamid} />}
                    </div>
                    <ul className="nav nav-tabs tabs-alt justify-content-center">
                        <li className="nav-item">
                            <a className="nav-link py-4 active" href="#">Media</a>
                        </li>
                    </ul>
                </div>
            </div>

        </div>

    );

}

