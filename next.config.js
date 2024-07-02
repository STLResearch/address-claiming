module.exports = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'api.mapbox.com',
          port: '',
          pathname: '/styles/**',
        },
        {
          protocol: 'https',
          hostname: 'maps.locationiq.com',
          port: '',
          pathname: '/v3/**',
        },
        {
          protocol: 'https',
          hostname: 'ipfs.sky.trade',
          port: '',
          pathname: '/ipfs/**',
        },
        
      ],
    },
  }