import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic';
import keystaticConfig from '../../../../keystatic.config';

export const prerender = false;

const handler = makeGenericAPIRouteHandler({
  config: keystaticConfig,
  clientId: process.env.KEYSTATIC_GITHUB_CLIENT_ID,
  clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
  secret: process.env.KEYSTATIC_SECRET,
});

export const ALL: import('astro').APIRoute = async (context) => {
  const { body, headers, status } = await handler(context.request);
  return new Response(body, { status, headers: headers as HeadersInit });
};
