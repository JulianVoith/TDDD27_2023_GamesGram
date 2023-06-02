import Image from 'next/image';
import Link from 'next/link';

//Component for displaying post on a profile
const PostWall = ({ userInfo, media }) => {

  //TODO change to api
  let url = "http://localhost:5001";

  //get steamid of inspected user
  const steamid = userInfo ? userInfo.steamid : media.steamid;

  //Posts link back to [steamid]. once router query changes and postID is added, Modal is popping up and shows the image
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
