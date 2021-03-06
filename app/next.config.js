const withCSS = require('@zeit/next-css');

const envToVarMap = {
  'development': './secrets.dev.json',
  'production': './secrets.json'
};

const serverVariables = require(envToVarMap[process.env.NODE_ENV]);
for (var key in serverVariables) {
  const value = serverVariables[key];
  if (!process.env[key]) {
    process.env[key] = value;
  }
}

module.exports = withCSS({
  target: 'serverless',
  env: {
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    API_AUDIENCE: process.env.API_AUDIENCE,
    AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    API_URL: process.env.API_URL
  }
});
