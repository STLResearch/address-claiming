module.exports = {
  apps : [{
    name   : "sky.trade.frontend",
    script: 'node_modules/next/dist/bin/next',
    autorestart: true,
    watch: false,
    env_dev: {
      NODE_ENV: "dev"
    },
    env_prod: {
      NODE_ENV: "prod"
    }
  }],
}
