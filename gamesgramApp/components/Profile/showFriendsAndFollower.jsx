import { Button, Modal } from 'react-bootstrap';
import {useState} from 'react';
import Card from '@/components/Search/card';

//Component to show a useres follower and steam freinds
const ShowFriendsAndFollower = ({friends, follower}) => {


    //Data hooks for post creation
    const [show, setShow] = useState(false); //Show and close modal
    const [content, setContent] = useState(null);
    const [contentType, setContentType] = useState(null);
    
    //Method to close the modal
    const handleClose = () => setShow(false);

    //Methods to show follower or friends depending on interaction
    const handleFollowerClick = () => {
        setContent(follower);
        setContentType("Follower");
        setShow(true);
    }
    const handleFriendsClick = () => {
        setContent(friends);
        setContentType("Friends");
        setShow(true);
    }

    return (
        <>  
            <a onClick={handleFollowerClick} className="d-inline-block text-dark">
                <strong>{follower.length}</strong>
                <span className="text-muted"> followers</span>
            </a>
            <br />
            <a onClick={handleFriendsClick} className="d-inline-block text-dark ml-3" >
                <strong>{friends.length}</strong>
                <span className="text-muted"> Steam friends</span>
            </a>

        
            { content && <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{ contentType==="Follower" ? <p>Followers</p> : <p>Friends</p>}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    { content.map((entry) => (
                        <div>
                            <Card key={entry.steamid} userInfo={entry} />
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            }
        </>
    );
}

export default ShowFriendsAndFollower