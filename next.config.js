/** @type {import('next').NextConfig} */
const nextConfig = {
  // Custom server handles requests, so we disable the default server
  // headers for security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=self, microphone=self",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
