/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.kroger.com",
        port: "",
        pathname: "/product/images/**",
      },
    ],
  },
};

export default nextConfig;
