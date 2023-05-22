import Image from 'next/image';

const Post = ({ id, urlPost, pathname }) => {

  return (
    <div>
      <Image 
      src={urlPost} 
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
    </div>
    
  )
  /*console.log(urlPost)
  return( <div>hi {urlPost} </div>)*/
}

export default Post

