import Context from '@/context/Context';
import { useState, useEffect,useContext } from 'react';
import Image from 'next/image';

const CommentSubmit = ({postID, commentID}) => {

    const {userInfo} = useContext(Context); 
    const [steamid, setSteamid] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [commentBox, setCommentBox] = useState(null);

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

    //Submitting written comment
    const handleCommentSubmit = async (event) => {

        //preventing auto refresh
        event.preventDefault();

        let commentData = {
        "commentID": commentID,
        "likes": 0,
        "authorSteamID": steamid,
        "postID": postID,
        "content": commentBox
        }; //steamid, postid content

        
        const JSONComment = JSON.stringify(commentData);

            // API endpoint where we send form data.
            const endpoint = '/api/sendComment';

            // Form the request for sending data to the server.
            const options = {
            // The method is POST because we are sending data.
            method: 'POST',
            // Tell the server we're sending JSON.
            headers: {
                'token': localStorage.getItem("token"),
                'Content-Type': 'application/json',
            },
            // Body of the request is the JSON data we created above.
            body: JSONComment,
            };

            // Send the form data to our forms API on Vercel and get a response.
            const response = await fetch(endpoint, options);
            
            if (!response.ok){
            console.log("error");
            }else{
            document.getElementById("commentInputForm").reset();
            setCommentBox("");
            console.log("success");

            //alter structure here and reload div? depending how we are implementing likes and comments
            }
    }


    return (
        <>
        
        <div className="mt-3 d-flex flex-row align-items-center p-3 form-color">

            {avatar ? <Image src={avatar} width={50} height={50} className="rounded-circle mr-2" alt={steamid} /> : null}
            <form id="commentInputForm" onSubmit={handleCommentSubmit}>
                    <input required onChange={(e) => setCommentBox(e.target.value)} value={commentBox} type="text" className="form-control" placeholder="Enter your comment..." id="commentBox"/>
            </form>
        </div>
        
        
        </>
    )
}

export default CommentSubmit