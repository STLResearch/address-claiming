module.exports = {
  apps : [{
    name   : "sky.trade.frontend",
    script: 'node_modules/next/dist/bin/next',
    autorestart: true,
    watch: false,
    args: "start",
    env_dev: {
      NODE_ENV: "development"
    },
    env_prod: {
      NODE_ENV: "production"
    }
  }],
}
