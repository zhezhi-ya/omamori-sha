import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "off",
  },
  {
    key: "X-Permitted-Cross-Domain-Policies",
    value: "none",
  },
  {
    key: "Permissions-Policy",
    value:
      "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  },
];

const productionSecurityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];

const isGithubPages = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath = "/omamori-sha";
const basePath = isGithubPages ? githubPagesBasePath : "";

const nextConfig: NextConfig = {
  ...(isGithubPages
    ? {
        output: "export",
        basePath,
        assetPrefix: basePath,
        trailingSlash: true,
        images: {
          unoptimized: true,
        },
      }
    : {
        async headers() {
          return [
            {
              source: "/:path*",
              headers:
                process.env.NODE_ENV === "production"
                  ? [...securityHeaders, ...productionSecurityHeaders]
                  : securityHeaders,
            },
          ];
        },
      }),
};

export default nextConfig;
