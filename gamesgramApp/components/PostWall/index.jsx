import Image from 'next/image';
import Link from 'next/link';


const PostWall = ({ userInfo, media }) => {

  //let medias = media;
  let url = "http://localhost:5001";//+ props.media.url; 

  //userInfo can be empty
  const steamid = userInfo ? userInfo.steamid : media.steamid;

  //{mediae.filenam.split(".")[0]}`}
  return (

    <div>
      {media.map((mediae) => (
        <Link
          key={mediae.filenam.split(".")[0]}
          href={`${steamid}/?postID=${mediae.filenam}`}
          as={`/${steamid}/?postID=${mediae.filenam}`}
          shallow={true}
          scroll={false}
        >
          <Image
            src={url + mediae.url}
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
        </Link>
      ))}
    </div>
  );


};

export default PostWall;