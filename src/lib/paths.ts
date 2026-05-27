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

export function optimizedImageFallbackPath(path: string): string | null {
  if (!path.includes("/images/optimized/generated-themes/") || !path.endsWith(".webp")) {
    return null;
  }

  return path
    .replace("/images/optimized/generated-themes/", "/images/generated-themes/")
    .replace(/\.webp$/, ".png");
}
