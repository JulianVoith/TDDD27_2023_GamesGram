import { useState, useEffect,useContext } from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import CommentSubmit from './commentSubmit';

const CommentBox = ({comment, subComment}) => {

    //Hook for showing and closing comment section of the post
    const [commentsEnabled, setCommentsEnabled] = useState(false);

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

  const [liked, setLiked] = useState(undefined);
  const [likesCount, setLikesCount] = useState(undefined);
  useEffect(() => {checkLiked();}, [comment.id]);
  useEffect(() => {getLikeCount();}), [liked];
  //Get like count every second
  useEffect(() => {
    const interval = setInterval(() => {
      getLikeCount();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
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
      // Update likes count based on the response
      if (response.ok) {
        setLikesCount(data.likesCount);
      } else {
        // Handle error here
        console.error(`Error: ${data}`);
      }
    }
  };


    return (
        <> {commenter ? 
            <div className="d-flex flex-row p-3">
                <Image src={commenter.response.players[0].avatar} width={50} height={50} className="rounded-circle mr-2" alt={comment.authorSteamID}/> 
                <div className="w-100">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex flex-row align-items-center">
                            <span className="mr-2">{commenter.response.players[0].personaname}</span>
                            
                        </div>
                        <small>{comment.timestamp}</small>
                    </div>
                    <p className="text-justify comment-text mb-0">{comment.content}</p>
                    <div className="d-flex flex-row user-feed">
                        <span className="wish"><i className="fa fa-heartbeat mr-2"></i>{likesCount ? <p>{likesCount} {likesCount === 1 ? 'player' : 'players'} liked</p> : <br />}</span>
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