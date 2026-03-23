export const getAuthCookieName = () => process.env.AUTH_COOKIE_NAME || process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'token';
