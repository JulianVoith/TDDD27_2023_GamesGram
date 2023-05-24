/** @type {import('next').NextConfig} */

// next.config.js
module.exports = () => {

  const rewrites = () => {
    return [
      {
        source: "/api/login/:path*",
        destination: "http://127.0.0.1:5000/login/:path*",
      },
      {
        source: "/authWSteam2/:path*",
        destination: "http://127.0.0.1:5000/authWSteam2/:path*",
      },
      {
        source: "/processSteamLogin/:path*",
        destination: "http://127.0.0.1:5000/processSteamLogin/:path*",
      },
      {
        source: "/api/GetUserInfo/:path*",
        destination: "http://127.0.0.1:5000/GetUserInfo/:path*",
      },
      {
        source: "/api/GetFriendList/:path*",
        destination: "http://127.0.0.1:5000/GetFriendList/:path*",
      },
      {
        source: "/api/SignOut/:path*",
        destination: "http://127.0.0.1:5000/signout/:path*",
      },
      {
        source: "/api/search/:path*",
        destination: "http://127.0.0.1:5000/search/:path*",
      },
      {
        source: "/api/createPost/:path*",
        destination: "http://127.0.0.1:5000/createPost/:path*",
      },
      {
      source: "/api/getUsers/:path*",
      destination: "http://127.0.0.1:5000/getUsers/:path*",
      },
      {
        source: "/api/getPosts/:path*",
        destination: "http://127.0.0.1:5000/getPosts/:path*",
      },
      {
        source: "/image_feed/:path*",
        destination: "http://127.0.0.1:5000/image_feed/:path*",
      },
      {
        source: "/api/GetRecentlyPlayedGames/:path*",
        destination: "http://127.0.0.1:5000/GetRecentlyPlayedGames/:path*",
      },
      {
        source: "/api/follow/:path*",
        destination: "http://127.0.0.1:5000/follow/:path*",
      },
      {
        source: "/api/unfollow/:path*",
        destination: "http://127.0.0.1:5000/unfollow/:path*",
      },
      {
        source: "/api/getFollowers/:path*",
        destination: "http://127.0.0.1:5000/getFollowers/:path*",
      },
      {
        source: "/api/getHome/:path*",
        destination: "http://127.0.0.1:5000/getHome/:path*",
      }
    ];
  };

  return {
    images: {
      domains: ["steamcdn-a.akamaihd.net","avatars.akamai.steamstatic.com","localhost"],
      unoptimized: true,
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '5000',
          pathname: '/image_feed/**',
        }
      ],
    },
    rewrites,
  };

};