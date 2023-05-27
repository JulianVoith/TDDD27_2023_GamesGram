
import Image from 'next/image';
import Link from 'next/link';

//Card component of the user card component
export default function Card(props){
    const userInfo = props.userInfo;
    return(
            <>
            <h1>{userInfo.personaname}</h1>
            <Link href={`/${userInfo.steamid}`} as = {`/${userInfo.steamid}`} 
             shallow={true} >
              <Image 
              src={userInfo.avatarfull} 
              width={100}
              height={100}
              alt={`${userInfo.personaname}'s avatar`}
              />
            </Link>
          </>
    );
  }