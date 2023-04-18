/** @type {import('next').NextConfig} */

module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/api/login/:path*",
        destination: "http://127.0.0.1:5000/login/:path*",
      },
      {
        source: "/auth/:path*",
        destination: "http://127.0.0.1:5000/auth/:path*",
      },
    ];
  };
  return {
    rewrites,
  };
};