const apiProviders = require('./apiProviders');

const config = {
    server: {
      port: process.env.PORT || 3001,
    },
    apiProviders,
  };
  
  module.exports = config;
  