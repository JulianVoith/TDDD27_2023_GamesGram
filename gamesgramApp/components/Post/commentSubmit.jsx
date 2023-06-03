import Context from '@/context/Context';
import { useState, useEffect,useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';

//Component for writing comments
const CommentSubmit = ({postID, commentID}) => {

    //Data hooks for user information of logged in user and comment input field
    const {userInfo} = useContext(Context); 
    const [steamid, setSteamid] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [commentBox, setCommentBox] = useState(null);

    //Effect to make sure context is loaded and set hooks(avatar and steamid)
    useEffect(() => {
        if(userInfo && !steamid){
            initFields();
        }
    },[userInfo]);
    const initFields = () => {
        setSteamid(userInfo.steamid);
        setAvatar(userInfo.avatarfull);
    };

    //Submit function of comment form. Could be handled by SWR with different fetcher
    const handleCommentSubmit = async (event) => {

        //Preventing auto refresh
        event.preventDefault();

        //Data structure for comment store procedure
        let commentData = {
        "commentID": commentID,  //ID of the comment. only set in case sent comment is a sub comment
        "authorSteamID": steamid, //Authors steam id
        "postID": postID,   //ID of the post
        "content": commentBox //Content of the comment input
        }; 
        
        const JSONComment = JSON.stringify(commentData);

        const endpoint = '/api/sendComment';

        const options = {
            method: 'POST',
            headers: {
                'token': localStorage.getItem("token"),
                'Content-Type': 'application/json',
            },
            body: JSONComment,
        };

        const response = await fetch(endpoint, options);
            
        if (!response.ok){
            console.log("error");
        }else{
            //Reset comment box
            document.getElementById("commentInputForm").reset();
            setCommentBox("");
            console.log("success");
        }
    }

    return (
        <>
            <div className="mt-3 d-flex flex-row align-items-center p-3 form-color">
                {avatar ? <Link href={`/${userInfo.steamid}`}><Image src={avatar} width={50} height={50} className="rounded-circle mr-2" alt={steamid} /></Link> : null}
                <form id="commentInputForm" onSubmit={handleCommentSubmit}>
                        <input required onChange={(e) => setCommentBox(e.target.value)} value={commentBox} type="text" className="form-control" placeholder="Enter your comment..." id="commentBox"/>
                </form>
            </div>
        </>
    )
}

export default CommentSubmit