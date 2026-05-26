export function assetPath(path: string): string {
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

  if (!path.startsWith("/")) {
    return path;
  }

  if (!basePath) {
    return path;
  }

  return `${basePath}${path}`;
}
