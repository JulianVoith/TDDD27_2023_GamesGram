import Image from 'next/image';

const Post = ({ id }) => {

  //General variables. Could be somwhere in the config files
  let urlImgaes = "http://localhost:5000/image_feed/" + id;
  //let urlVideos = "http://localhost:5000/video_feed/"; // not yet implemented for future use maybe
  //let urlAUdios = "http://localhost:5000/audio_feed/"; // not yet implemented 


  //change styling stuff
  return (
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

  )
  /*console.log(urlPost)
  return( <div>hi {urlPost} </div>)*/
}

export default Post

