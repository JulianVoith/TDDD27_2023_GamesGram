/** @type {import('next').NextConfig} */

module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/hello/:path*",
        destination: "http://127.0.0.1:5000/hello/:path*",
      },
    ];
  };
  return {
    rewrites,
  };
};