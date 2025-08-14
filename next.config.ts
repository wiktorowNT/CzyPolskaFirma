/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- DODAJ TEN FRAGMENT ---
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // --- KONIEC FRAGMENTU ---
};

export default nextConfig;