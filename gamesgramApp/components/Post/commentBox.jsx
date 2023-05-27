import { useState, useEffect,useContext } from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import CommentSubmit from './commentSubmit';

const CommentBox = ({comment, subComment}) => {
    const [commentsEnabled, setCommentsEnabled] = useState(false);

    const fetcher = (...args) => fetch(...args).then(res => res.json())
    const { data } = useSWR(`/api/GetUserInfo/${comment.authorSteamID}`, fetcher);
    const { data: subComments } = useSWR(`/api/getComments/${comment.postID}/${comment.id}`, fetcher, { refreshInterval: 1000 });


  //Show and hide comment section
  const handleCommentReply = () => {

    if (!commentsEnabled){
      setCommentsEnabled(true);
    }else {
      setCommentsEnabled(false);
    }

  }

//recursive commentbox works but no reset when sending
    return (
        <> {data ? 
            <div className="d-flex flex-row p-3">
                <Image src={data.response.players[0].avatar} width={50} height={50} className="rounded-circle mr-2" alt={comment.authorSteamID}/> 
                <div className="w-100">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex flex-row align-items-center">
                            <span className="mr-2">{data.response.players[0].personaname}</span>
                            
                        </div>
                        <small>{comment.timestamp}</small>
                    </div>
                    <p className="text-justify comment-text mb-0">{comment.content}</p>
                    <div className="d-flex flex-row user-feed">
                        <span className="wish"><i className="fa fa-heartbeat mr-2"></i>{comment.likes} likes</span>
                        <button type="button" className="btn btn-primary">Like</button>
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
//<Image src={userInfo[0].avatarfull} width={50} height={50} className="rounded-circle mr-2" alt={steamid} />
//<small className="c-badge">Top Comment</small>

}

export default CommentBox