/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // For GSAP and Three.js canvas stability
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
};

export default nextConfig;
