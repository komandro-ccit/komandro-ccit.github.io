/**
 * Helper to resolve internal URLs with BASE_URL prefix
 * External URLs (http, https, mailto, tel) are returned as-is
 */
export function link(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('mailto:') || path.startsWith('tel:')) {
    return path;
  }
  
  const base = import.meta.env.BASE_URL;
  
  if (path.startsWith(base)) {
    return path;
  }
  
  if (path.startsWith('/')) {
    return base + path.slice(1);
  }
  
  return path;
}
