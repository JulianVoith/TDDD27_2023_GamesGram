import { useRouter } from 'next/router';
import Post from '@/components/Post';

const PostPage = () => { //"{ steamid, postID }"
  const router = useRouter();

  const { postID } = router.query;

  //console.log(steamid, postID);

  //useEffect(() => {
  //  router.prefetch(`/${steamid}`);
    
  //}, []);

  /*return (
    <>
    <Modal isOpen={true} onRequestClose={() => router.push(`/${steamid}`, undefined, {scroll: false})}>
      <Modal.Header closeButton>
        <Modal.Title>Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Post id={postID} pathname={router.pathname} />
      </Modal.Body>
    </Modal>
    <PostWall ></PostWall>
    </>
  );*/
  //return(<>hallo</> );

  return <Post id ={postID} pathname={router.pathname} /> //test with query string routing

};



export default PostPage;

// for dynamic routing but doesnt work hiere in that case