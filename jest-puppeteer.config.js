let config = {};
if (process.env.VISUAL) {
  config = {
    server: {
      command: 'npm run start',
      port: 8080,
      usedPortAction: 'ignore',
      launchTimeout: 30000
    }
  };
}

module.exports = config;
