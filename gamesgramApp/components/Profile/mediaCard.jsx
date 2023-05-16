import {Card, Col} from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

//TODO: adjust height n stuff
export default function MediaCard(props) {

    console.log(props);
    const router = useRouter();
    const { imgID } = router.query;

    let url = "http://localhost:5000" + props.media.url;    

    function openDetailMediaView(){
        console.log("hi");

        return true;
    }


    return (
        
        /*Col className="col-lg-4 d-flex align-items-stretch">
            <Card className="card d-flex flex-column justify-content-end align-items-center" onClick={openDetailMediaView}>   
                <Card.Img className="d-flex flex-column justify-content-end align-items-center" variant="top" src = {url}  />
            </Card>
        </Col>*/
       // <Link
       //     href={`/?photoId=${props.media.filenam}`}
       //     as={`/p/${props.media.filenam}`}
       //     shallow
       //     >
       //   <Image src={url} width={200} height={200}/> 
       // </Link>
       <p> test</p>
    )

//onlick card to open modal with picture comments etc
}

/*
 return (
        
        <Col className="col-lg-4 d-flex align-items-stretch">
            <Card className="card d-flex flex-column justify-content-end align-items-center" onClick={openDetailMediaView}>   
                <Card.Img className="d-flex flex-column justify-content-end align-items-center" variant="top" src = {url}  />
            </Card>
        </Col>
        
    )
*/