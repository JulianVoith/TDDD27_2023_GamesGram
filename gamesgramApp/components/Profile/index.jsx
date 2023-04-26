import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import cx from 'classnames';
import styles from '@/styles/Profile.module.css';
import {Button,Modal,Form} from 'react-bootstrap';
import FriendsContext from '@/context/FriendsContext';

//col-md-10 col-lg-8 col-xl-7 image above
/*
                    <li className="nav-item">
                    <a className="nav-link py-4" href="#">Likes</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link py-4" href="#">Followers</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link py-4" href="#">Following</a>
                    </li>
                    profile items
*/
export default function profile(props){
    const router = useRouter()
    const { nFriends,setFriends } = useContext(FriendsContext);
    const [nFollower, setFollower] = useState(0);
    const [triggerUpl, setTriggerUpl] = useState(false);
    

    const amountFriends = async () => {

        let token = localStorage.getItem("token");

        //if(!props.userInfo && token !== null){
            const JSONdata = JSON.stringify({'steamid': props.userInfo.steamid})
            console.log(JSONdata);
            
                // API endpoint where we send form data.
                const endpoint = '/api/GetFriendList'
            
                // Form the request for sending data to the server.
                const options = {
                    // The method is POST because we are sending data.
                    method: 'POST',
                    // Tell the server we're sending JSON.
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    // Body of the request is the JSON data we created above.
                    body: JSONdata,
                }
            
                // Send the form data to our forms API on Vercel and get a response.
                const response = await fetch(endpoint, options); //, options)
                const data = await response.json();
                if(data!==nFriends)
                {
                    setFriends(data["friendslist"]["friends"]);
                }
        //}
    }

    function Header(){

        useEffect(()=>{
            amountFriends()
        }, [nFriends]);

        const [show, setShow] = useState(false);

        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);
    
        
        //shall bee shown in a small popup
        //under construct!!!!
        function UploadMedia(){

            //const [steamID, setSteamId] = useState('');
            //const [steamID, setSteamId] = useState('');
            
            const handleSubmit = async (event) => {
                event.preventDefault();
               const token = await submitForm(steamID);//email, password);
               props.onLogin(token);
               return false;
            };

           return (
             <>
               <Button variant="primary" onClick={handleShow}>
                 Upload Media
               </Button>

               <Modal show={show} onHide={handleClose}>
                 <Modal.Header closeButton>
                   <Modal.Title>Upload Media</Modal.Title>
                 </Modal.Header>
                 <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} />
                        </Form.Group>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Select file</Form.Label>
                            <Form.Control type="file" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Who should see your post?</Form.Label>
                            <Form.Select aria-label="Default select example">
                                <option value="1">Everyone</option>
                                <option value="2">Followers</option>
                                <option value="3">Steam friends</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Category/Game</Form.Label>
                            <Form.Select aria-label="Default select example">
                                <option value="1">Example: Mirror's Edge</option>
                                <option value="2">Example: Overwatch 2</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                 </Modal.Body>
                 <Modal.Footer>
                   <Button variant="secondary" onClick={handleClose}>
                     Close
                   </Button>
                   <Button variant="primary" onClick={handleClose}>
                     Upload
                   </Button>
                 </Modal.Footer>
               </Modal>
             </>
           );
    
    
        }

        function Follow(){
            //different display depending on profile
            //your own profile? maybe disapear
            //others depending on follow or not follow. possibility to unfollow
            return (
                <>
                    <Button variant="primary">
                     Follow
                    </Button>
                </>
            );
        }

        const routeToSteam_friends = () => {
            router.push({
              pathname: '/steam_friends',
            });
          };
        

        return (
        
        <div >
            <div className="container bootstrap-snippet header-container">
                <div className="bg-white">
                <div className="container py-5">
                    <div className= "media row p-0 my-4 mx-auto">
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
                            Add About Text here. Needs to be aligned with data structure and possible to change.
                            Could be possible through table and possibility to change
                            TODOS:
                            -Upload Image with category and authorization
                            -possible to follower
                            -showing pictures with comments etc
                            </div>
                            <a href="/followers" className="d-inline-block text-dark">
                            <strong>{nFollower}</strong>
                            <span className="text-muted"> followers</span>
                            </a>
                            <br />
                            <a onClick={routeToSteam_friends} className="d-inline-block text-dark ml-3" >
                            {nFriends ? <strong>{nFriends.length}</strong> :<strong>Loading...</strong>}
                            <span className="text-muted"> Steam friends</span>
                            </a>
                        </div>
                        <br />
                        <Follow /> 
                        <UploadMedia />
                    </div>
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

    return (
        <>
        <div> 
            <Header />
        </div>
        <div>
            Place for Media
        </div>
        </>
    )
}
