import Image from 'next/image';
import Context from '@/context/Context';
import { useState, useEffect,useContext } from 'react';

import useSWR from 'swr';
import CommentBox from './commentBox';
import { useRouter } from 'next/router';
import CommentSubmit from './commentSubmit';



const Post = ({ postID }) => {

    
    const [commentsEnabled, setCommentsEnabled] = useState(false);

    //test of different data fetching
    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    const { data: comments } = useSWR(commentsEnabled ? `/api/getComments/${postID}`: null, fetcher, { refreshInterval: 1000 }); //can fetch with token and preload on hover or whatever, allows subscribing to real-time data source or websocket

 


  //General variables. Could be somwhere in the config files
  let urlImgaes = "http://localhost:5001/image_feed/" + postID;
  //let urlVideos = "http://localhost:5001/video_feed/"; // not yet implemented for future use maybe
  //let urlAUdios = "http://localhost:5001/audio_feed/"; // not yet implemented 

  //Show and hide comment section
  const handleComments = () => {

    if (!commentsEnabled){
      setCommentsEnabled(true);
    }else {
      setCommentsEnabled(false);
    }

  }

  return (
    <>
      <div>
        <Image 
        src={urlImgaes} 
        width={450} //standrad size of mdoal 
        height={450} 
        className="transform rounded-lg brightness-90 transition group-hover:brightness-110"
        alt="Pricture" 
        sizes="(max-width: 640px) 100vw,
        (max-width: 1280px) 50vw,
        (max-width: 1536px) 33vw,
        25vw"
        style={{ transform: "translate3d(0, 0, 0)" }}
        /> 
      </div>

      <div>
          <button type="button" className="btn btn-primary">Like</button>
          <span> </span>
          <button type="button" className="btn btn-primary" onClick={handleComments}>Comment</button>
      </div>

      {commentsEnabled ? 
      <div className="container mt-5 mb-5" id="commentSection">
        <div className="row height d-flex justify-content-center align-items-center">
          <div className="col-xl-7">  
            <div className="card">
              <div className="p-3">
                <h6>Comments</h6>
              </div>

              <CommentSubmit key={"post"} postID = {postID} commentID = {0} />

                <div className="mt-2">
                {comments ? comments.map((comment) => (
                  <CommentBox key={comment.id} comment={comment} subComment={false}/>
                )) : null}
                </div>
            </div>
          </div>
        </div>
      </div>
      : null}

    </>
  )
  /*console.log(urlPost)
  return( <div>hi {urlPost} </div>)*/
}

export default Post

//FOR PRESENTATION
//incremental stati regeneration
//serverside probs video https://www.youtube.com/watch?v=Hb3Mo4kaI7E
//Check client side data fetching as well

/*export async function getServerSideProps(context) {

  console.log("HALLO?")
  context.res.setHeader('Chache-Control', 's-maxage=20,  stale-while-revalidate=60' );

  const resComments = await fetch(`http://127.0.0.1:5001/getComments/${context.query.postID}`);
  const postComments = await resComments.json();


  return {
    props: { postComments },
  };

}*/


/*export async function getStaticPaths(){


  const res = await fetch("http://127.0.0.1:5001/getComments/%");
  const comments = await res.json();
  
  console.log(comments);

  const paths = comments.map((comment) => ({
      params: { postID: comment.postID.toString()},
  }));

  return {paths, fallback: 'blocking'}; //fallback true in case the page never has been rendered
}

export async function getStaticProps( { params } ){
  
  //Notice: Don't fetch the server directly, use api interface
  const resComments = await fetch(`http://127.0.0.1:5001/getComments/${params.postID}`);
  const comments = await resComments.json();
  
  return {
    props: {
      key: params.postID,
      postID: params.postID,
      postComments: comments,
    },
    revalidate: 10,
  };
}*/


/*              <div className="mt-3 d-flex flex-row align-items-center p-3 form-color">

                {avatar ? <Image src={avatar} width={50} height={50} className="rounded-circle mr-2" alt={steamid} /> : null}
                <form id="commentInputForm" onSubmit={handleCommentSubmit}>
                  <input required onChange={(e) => setCommentBox(e.target.value)} type="text" className="form-control" placeholder="Enter your comment..." id="commentBox"/>
                </form>
              </div>*/