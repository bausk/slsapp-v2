
if (process.env.NODE_ENV === 'development') {
  const serverVariables = require('./secrets.dev.json');
  for (var key in serverVariables) {
    const value = serverVariables[key];
    process.env[key] = value;
  }
}

module.exports = {
  publicRuntimeConfig: {
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    API_AUDIENCE: process.env.API_AUDIENCE,
    AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    API_URL: process.env.API_URL
  },
  serverRuntimeConfig: {
  }
};
