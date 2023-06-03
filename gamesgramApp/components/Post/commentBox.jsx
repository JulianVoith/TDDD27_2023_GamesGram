import { useState, useEffect,useContext } from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import CommentSubmit from './commentSubmit';
import Link from 'next/link';

//Component which will be used to show comments 
const CommentBox = ({comment, subComment}) => {

    //Hook for showing and closing comment section of the post
    const [commentsEnabled, setCommentsEnabled] = useState(false);

    //Hooks for like representation of a comment
    const [liked, setLiked] = useState(undefined);
    const [likesCount, setLikesCount] = useState(undefined);

    //SWR data feching hooks for commenter and subcomments of a comment
    const fetcher = (...args) => fetch(...args).then(res => res.json())
    const { data: commenter } = useSWR(`/api/GetUserInfo/${comment.authorSteamID}`, fetcher);
    //Interval for subcomments is set to regularly check for new comments which are going to be displayed immediately
    const { data: subComments } = useSWR(`/api/getComments/${comment.postID}/${comment.id}`, fetcher, { refreshInterval: 1000 });


  //Function to show and hide comment section
  const handleCommentReply = () => {
    if (!commentsEnabled){
      setCommentsEnabled(true);
    }else {
      setCommentsEnabled(false);
    }
  }

  //Effect for check likes and like count (can be done with SWR)
  useEffect(() => {checkLiked();}, [comment.id]);
  useEffect(() => {getLikeCount();}), [liked];

  //Get like count in an interval of every second to update like counts
  useEffect(() => {
    const interval = setInterval(() => {
      getLikeCount();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  //Function to check like count on server backend
  const checkLiked = async () => {
    if (window.localStorage.getItem("token")) {
      const endpoint = `/api/CommentLike/${comment.id}`
      const options = {
        method: 'HEAD',
        headers: {
          'Content-Type': 'application/json',
          'token': window.localStorage.getItem("token"),
        },
      }
      const response = await fetch(endpoint, options)
      if (response.status === 200) setLiked(true);
      else if (response.status === 404) setLiked(false);
    }
  };

  //Function to delete like from server backend
  const deleteLike = async () => {
    if (window.localStorage.getItem("token")) {
      const endpoint = `/api/CommentLike/${comment.id}`

      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'token': window.localStorage.getItem("token"),
        },
      }
      const response = await fetch(endpoint, options)
      if (response.status === 200) setLiked(false);
    }
  };

  //Function to create like on server backend 
  const createLike = async () => {
    if (window.localStorage.getItem("token")) {
      const endpoint = `/api/CommentLike/${comment.id}`
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': window.localStorage.getItem("token"),
        },
      }
      const response = await fetch(endpoint, options)
      if (response.status === 201) setLiked(true);
    }
  };

  //function to fetch like count
  const getLikeCount = async () => {
    if (window.localStorage.getItem("token")) {
      const endpoint = `/api/CommentLike/${comment.id}`
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': window.localStorage.getItem("token"),
        },
      }

      const response = await fetch(endpoint, options);
      const data = await response.json();
      
      if (response.ok) {
        setLikesCount(data.likesCount);
      } else {
        console.error(`Error: ${data}`);
      }
    }
  };


    return (
        <> {commenter ? 
            <div className="d-flex flex-row p-3">
              <Link href={`http://localhost:3000/${commenter.response.players[0].steamid}`}>
                <Image src={commenter.response.players[0].avatarfull} width={50} height={50} className="rounded-circle mr-2" alt={comment.authorSteamID} /> 
                </Link>
                <div className="w-100">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex flex-row align-items-center">
                            <span className="mr-2">{commenter.response.players[0].personaname}</span>
                            
                        </div>
                        <small>{comment.timestamp}</small>
                    </div>
                    <p className="text-justify comment-text mb-0">{comment.content}</p>
                    <div className="d-flex flex-row user-feed">
                        <div className="wish"><i className="fa fa-heartbeat mr-2"></i>{likesCount ? <p>{likesCount} {likesCount === 1 ? 'player' : 'players'} liked</p> : null}<br /></div>
                        {liked
                        ? <button type="button" onClick={deleteLike} className="btn btn-outline-primary">Liked</button>
                        : <button type="button" onClick={createLike} className="btn btn-primary">Like</button>
                        }
                        { subComment ? null : <button type="button" className="btn btn-primary" onClick={handleCommentReply}>reply</button>}
                    </div>
                        {subComments ? subComments.map((subComment) => (
                            <div className="d-flex flex-row user-feed">
                                <CommentBox key={subComment.id} comment={subComment} subComment={true}/>
                            </div>
                        )) : null}
                    <div className="d-flex flex-row user-feed">
                        {commentsEnabled ? <CommentSubmit key={"sub"} postID={comment.postID} commentID={comment.id} /> : null}
                    </div>
                </div>
            </div>
            : null}
        </>
    )
}

export default CommentBox