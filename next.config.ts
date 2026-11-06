import type { NextConfig } from 'next'

// GitHub Pages(정적 호스팅)용: next build → out/ 폴더
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
}
export default nextConfig
