import Image from 'next/image';
import Context from '@/context/Context';
import { useState, useEffect,useContext } from 'react';

const Post = ({ id }) => {

    //Fetch userContext
    const {userInfo} = useContext(Context); 
    const [steamid, setSteamid] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [commentsEnabled, setCommentsEnabled] = useState(false);
  
  
    //TODO: maybe google if there is a better way
    useEffect(() => {
      if(userInfo && !steamid){
        initFields();
      }
    },[userInfo]);
    
    const initFields = () => {
      setSteamid(userInfo.steamid);
      setAvatar(userInfo.avatar);
    };

  //General variables. Could be somwhere in the config files
  let urlImgaes = "http://localhost:5001/image_feed/" + id;
  //let urlVideos = "http://localhost:5001/video_feed/"; // not yet implemented for future use maybe
  //let urlAUdios = "http://localhost:5001/audio_feed/"; // not yet implemented 


  //STEP 1: Normal comments,
  //Step 2: replys and likes of comments, replys in replies?

  //change styling stuff

  // Data structure for comments
  //Function to send a comment
  //show only limited number
  //expand if necesssary
  

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
          <div className="col-md-7">  
            <div className="card">
              <div className="p-3">
                <h6>Comments</h6>
              </div>

              <div className="mt-3 d-flex flex-row align-items-center p-3 form-color">

                {avatar ? <Image src={avatar} width={50} height={50} className="rounded-circle mr-2" alt={steamid} />: null}
                <input type="text" className="form-control" placeholder="Enter your comment..."/>

              </div>
              <div className="mt-2">

                <div className="d-flex flex-row p-3">

                  <img src="https://i.imgur.com/zQZSWrt.jpg" width="40" height="40" className="rounded-circle mr-3"/>

                  <div className="w-100">

                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex flex-row align-items-center">
                        <span className="mr-2">Brian selter</span>
                        <small className="c-badge">Top Comment</small>
                      </div>
                    <small>12h ago</small>
                    </div>
                    <p className="text-justify comment-text mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam</p>
                    <div className="d-flex flex-row user-feed">
                      <span className="wish"><i className="fa fa-heartbeat mr-2"></i>24</span>
                      <span className="ml-3"><i className="fa fa-comments-o mr-2"></i>Reply</span>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-row p-3">
                  <img src="https://i.imgur.com/3J8lTLm.jpg" width="40" height="40" className="rounded-circle mr-3"/>
                  <div className="w-100">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex flex-row align-items-center">
                        <span className="mr-2">Seltos Majito</span>
                        <small className="c-badge">Top Comment</small>
                      </div>
                      <small>2h ago</small>
                    </div>
                    <p className="text-justify comment-text mb-0">Tellus in hac habitasse platea dictumst vestibulum. Lectus nulla at volutpat diam ut venenatis tellus. Aliquam etiam erat velit scelerisque in dictum non consectetur. Sagittis nisl rhoncus mattis rhoncus urna neque viverra justo nec. Tellus cras adipiscing enim eu turpis egestas pretium aenean pharetra. Aliquam faucibus purus in massa.</p>
                    <div className="d-flex flex-row user-feed">
                      <span className="wish"><i className="fa fa-heartbeat mr-2"></i>14</span>
                      <span className="ml-3"><i className="fa fa-comments-o mr-2"></i>Reply</span>
                    </div>  
                  </div>
                </div>
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

