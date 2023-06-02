/** @type {import('next').NextConfig} */

// next.config.js
module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/api/login/:path*",
        destination: "http://127.0.0.1:5001/login/:path*",
      },
      {
        source: "/authWSteam2/:path*",
        destination: "http://127.0.0.1:5001/authWSteam2/:path*",
      },
      {
        source: "/processSteamLogin/:path*",
        destination: "http://127.0.0.1:5001/processSteamLogin/:path*",
      },
      {
        source: "/api/GetUserInfo/:path*",
        destination: "http://127.0.0.1:5001/GetUserInfo/:path*",
      },
      {
        source: "/api/GetFriendList/:path*",
        destination: "http://127.0.0.1:5001/GetFriendList/:path*",
      },
      {
        source: "/api/SignOut/:path*",
        destination: "http://127.0.0.1:5001/signout/:path*",
      },
      {
        source: "/api/search/:path*",
        destination: "http://127.0.0.1:5001/search/:path*",
      },
      {
        source: "/api/createPost/:path*",
        destination: "http://127.0.0.1:5001/createPost/:path*",
      },
      {
        source: "/api/getUsers/:path*",
        destination: "http://127.0.0.1:5001/getUsers/:path*",
      },
      {
        source: "/api/getPosts/:path*",
        destination: "http://127.0.0.1:5001/getPosts/:path*",
      },
      {
        source: "/image_feed/:path*",
        destination: "http://127.0.0.1:5001/image_feed/:path*",
      },
      {
        source: "/api/GetRecentlyPlayedGames/:path*",
        destination: "http://127.0.0.1:5001/GetRecentlyPlayedGames/:path*",
      },
      {
        source: "/api/follow/:path*",
        destination: "http://127.0.0.1:5001/follow/:path*",
      },
      {
        source: "/api/unfollow/:path*",
        destination: "http://127.0.0.1:5001/unfollow/:path*",
      },
      {
        source: "/api/getFollowers/:path*",
        destination: "http://127.0.0.1:5001/getFollowers/:path*",
      },
      {
        source: "/api/getHome/:path*",
        destination: "http://127.0.0.1:5001/getHome/:path*",
      },
      {
        source: "/api/sendComment/:path*",
        destination: "http://127.0.0.1:5001/sendComment/:path*",
      },
      {
        source: "/api/getComments/:path*",
        destination: "http://127.0.0.1:5001/getComments/:path*",
      },
      {
        source: "/api/PostLike/:path*",
        destination: "http://127.0.0.1:5001/PostLike/:path*",
      },
      {
        source: "/api/CommentLike/:path*",
        destination: "http://127.0.0.1:5001/CommentLike/:path*",
      }
          ];
  };

  return {
    images: {
      domains: [
        "steamcdn-a.akamaihd.net",
        "avatars.akamai.steamstatic.com",
        "localhost",
      ],
      unoptimized: true,
      remotePatterns: [
        {
          protocol: "http",
          hostname: "localhost",
          port: "5001",
          pathname: "/image_feed/**",
        },
      ],
    },
    rewrites,
  };
};
