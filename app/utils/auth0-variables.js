import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export const AUTH_CONFIG = {
  domain: publicRuntimeConfig.AUTH0_DOMAIN,
  clientId: publicRuntimeConfig.AUTH0_CLIENT_ID,
  callbackUrl: publicRuntimeConfig.AUTH0_CALLBACK_URL,
  audience: publicRuntimeConfig.API_AUDIENCE
};