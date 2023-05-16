import {Card, Col} from 'react-bootstrap';
import Image from 'next/image';

//TODO: adjust height n stuff
export default function MediaCard(props) {

    let url = "http://localhost:5000" + props.media.url;    

    function openDetailMediaView(){
        console.log("hi");

        return true;
    }


    return (
        
        <Col className="col-lg-4 d-flex align-items-stretch">
            <Card className="card d-flex flex-column justify-content-end align-items-center" onClick={openDetailMediaView}>   
                <Card.Img className="d-flex flex-column justify-content-end align-items-center" variant="top" src = {url}  />
            </Card>
        </Col>
        
    )

//onlick card to open modal with picture comments etc
}