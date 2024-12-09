/** @type {import('next').NextConfig} */
const nextConfig = { 
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
        },
      ],
    });
    return config;
  },
  images: {
    disableStaticImages: true, 
  },
  env: {
    BACKEND_WEBSOCKET_PROTOCOL: process.env.BACKEND_WEBSOCKET_PROTOCOL, 
    BACKEND_PLOTOCOL: process.env.BACKEND_PLOTOCOL,
    BACKEND_HOST: process.env.BACKEND_HOST,

    AGORA_APP_ID: process.env.AGORA_APP_ID,
  }
};

export default nextConfig;
