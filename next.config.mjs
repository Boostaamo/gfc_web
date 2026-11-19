/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  trailingSlash: false,
  // Vanhan WordPress-sivuston osoitteet (sivukartta GFC v4). /kasvujohtaja/ säilyy (kenoviiva ohjautuu automaattisesti).
  // /kasvuyrittaja -> Boostaamon Kasvukoneiston katsastus, kun boostaamo.fi on julkaistu; siihen asti etusivu.
  async redirects() {
    return [
      { source: "/kasvuyrittaja", destination: "/", permanent: false },
      { source: "/moderni-tuotannon-johtaminen/esimiehelle", destination: "/moderni-tuotannon-johtaminen/esihenkilolle", permanent: true },
      { source: "/wp-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/wp-admin/:path*", destination: "/", permanent: true },
      { source: "/wp-content/:path*", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
