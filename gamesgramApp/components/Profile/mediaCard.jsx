import {Card, Col} from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

//TODO: adjust height n stuff
export default function MediaCard(props) {

    console.log(props);
    const router = useRouter();
    const { photoId } = router.query;

    let url = "http://localhost:5000" + props.media.url;    

    function openDetailMediaView(){
        console.log("hi");

        return true;
    }


    return (
        
       /* <Col className="col-lg-4 d-flex align-items-stretch">
            <Card className="card d-flex flex-column justify-content-end align-items-center" onClick={openDetailMediaView}>   
                <Card.Img className="d-flex flex-column justify-content-end align-items-center" variant="top" src = {url}  />
            </Card>
        </Col>*/
        <Link
           href={`/?photoId=${props.media.filenam}`}
           as={`/post/${props.media.filenam}`}
           shallow 
           >
            <Image 
            src={url} 
            width={400} 
            height={400} 
            className="transform rounded-lg brightness-90 transition group-hover:brightness-110"
            alt="Pricture" 
            sizes="(max-width: 640px) 100vw,
            (max-width: 1280px) 50vw,
            (max-width: 1536px) 33vw,
            25vw"
            style={{ transform: "translate3d(0, 0, 0)" }}
            /> 
        </Link>
    )

//onlick card to open modal with picture comments etc
}

//#NOTE FOR FURTHER LEARNING: optimized and unoptimized image fetching. Needed to use unoptimized WAY TO USE IT?

/*
 return (
        
        <Col className="col-lg-4 d-flex align-items-stretch">
            <Card className="card d-flex flex-column justify-content-end align-items-center" onClick={openDetailMediaView}>   
                <Card.Img className="d-flex flex-column justify-content-end align-items-center" variant="top" src = {url}  />
            </Card>
        </Col>
        
    )
*/