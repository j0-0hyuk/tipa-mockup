const MOCKUP_ROUTE_PREFIXES = [
  '/start',
  '/start2',
  '/company',
  '/chatbot-flow',
  '/homepage-flow',
  '/admin-demo',
] as const;

export function isMockupRoutePath(pathname: string): boolean {
  return MOCKUP_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isMockupRuntimePath(): boolean {
  if (typeof window === 'undefined') return false;

  return isMockupRoutePath(window.location.pathname);
}
