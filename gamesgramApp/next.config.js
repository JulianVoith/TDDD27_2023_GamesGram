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
        source: "/auth/:path*",
        destination: "http://127.0.0.1:5000/auth/:path*",
      },
      {
        source: "/processSteamLogin/:path*",
        destination: "http://127.0.0.1:5000/processSteamLogin/:path*",
      },
      {
        source: "/api/GetUserInfo/:path*",
        destination: "http://127.0.0.1:5000/GetUserInfo/:path*",
      }
    ];
  };

  return {
    images: {
      domains: ["steamcdn-a.akamaihd.net","avatars.akamai.steamstatic.com"],
    },
    rewrites,
  };

};