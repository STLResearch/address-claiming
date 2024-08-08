module.exports = {
  images: {
    domains: ["ipfs.sky.trade", ""],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.mapbox.com",
        port: "",
        pathname: "/styles/**",
      },
      {
        protocol: "https",
        hostname: "maps.locationiq.com",
        port: "",
        pathname: "/v3/**",
      },
    ],
  },
};
