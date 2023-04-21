import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function profile(userInfo){
    userInfo =  {
        "players": [
            {
                "steamid": "76561198420357123",
                "communityvisibilitystate": 3,
                "profilestate": 1,
                "personaname": "覅忒好",
                "profileurl": "https://steamcommunity.com/profiles/76561198420357123/",
                "avatar": "https://avatars.akamai.steamstatic.com/9fd8d9838317a9cd7e43cdd8144bc8c94ce240b7.jpg",
                "avatarmedium": "https://avatars.akamai.steamstatic.com/9fd8d9838317a9cd7e43cdd8144bc8c94ce240b7_medium.jpg",
                "avatarfull": "https://avatars.akamai.steamstatic.com/9fd8d9838317a9cd7e43cdd8144bc8c94ce240b7_full.jpg",
                "avatarhash": "9fd8d9838317a9cd7e43cdd8144bc8c94ce240b7",
                "lastlogoff": 1592567693,
                "personastate": 0,
                "realname": "李一",
                "primaryclanid": "103582791429521408",
                "timecreated": 1505110971,
                "personastateflags": 0,
                "loccountrycode": "CN",
                "locstatecode": "23",
                "loccityid": 10301
            },
            {
                "steamid": "76561198418384075",
                "communityvisibilitystate": 3,
                "profilestate": 1,
                "personaname": "-ChanM1ng-",
                "commentpermission": 1,
                "profileurl": "https://steamcommunity.com/profiles/76561198418384075/",
                "avatar": "https://avatars.akamai.steamstatic.com/d4bc34793d0cb5e604291fbbb6ec5da36b3a8476.jpg",
                "avatarmedium": "https://avatars.akamai.steamstatic.com/d4bc34793d0cb5e604291fbbb6ec5da36b3a8476_medium.jpg",
                "avatarfull": "https://avatars.akamai.steamstatic.com/d4bc34793d0cb5e604291fbbb6ec5da36b3a8476_full.jpg",
                "avatarhash": "d4bc34793d0cb5e604291fbbb6ec5da36b3a8476",
                "lastlogoff": 1681836038,
                "personastate": 0,
                "realname": "Peak_zzy",
                "primaryclanid": "103582791429521408",
                "timecreated": 1504289801,
                "personastateflags": 0,
                "loccountrycode": "SE",
                "locstatecode": "21",
                "loccityid": 43766
            }
        ]
    };
    console.log(userInfo.players[0].personaname)
    return (
        <>
        <Avatar userInfo={userInfo.players[0]} />
        </>
    )
}
export function Avatar(userInfo){
    console.log(userInfo)
    return(
        <>
        <Image 
        src={userInfo.avatar}
        height={100}
        width={100}
        alt={userInfo.personaname}
        />
        </>
    )
}