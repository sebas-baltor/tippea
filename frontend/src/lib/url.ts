export function maskUrl(url: string) {
  if (!url) return "";
  try {
    const u = new URL(url);
    const path = u.pathname; // /jhon-address
    const host = u.host; // ilp.interledger-test.dev
    const compactPath =
      path.length > 4 ? `${path.slice(0, 2)}…${path.slice(-2)}` : path;
    const compactHost =
      host.length > 10 ? `${host.slice(0, 6)}…${host.slice(-3)}` : host;
    return `${u.protocol}//${compactHost}${compactPath}`;
  } catch {
    // fallback simple mask
    return url.length > 24 ? `${url.slice(0, 12)}…${url.slice(-8)}` : url;
  }
}
