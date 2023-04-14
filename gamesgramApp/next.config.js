/** @type {import('next').NextConfig} */

module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/login/:path*",
        destination: "http://127.0.0.1:5000/login/:path*",
      },
    ];
  };
  return {
    rewrites,
  };
};