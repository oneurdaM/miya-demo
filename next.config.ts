/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('next').NextConfig} */

const {i18n} = require('./next-i18next.config')

const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    domains: [
      // List of domains for image optimization
      'via.placeholder.com',
      'res.cloudinary.com',
      's3.amazonaws.com',
      '127.0.0.1:8000',
      'miro.medium.com',
      'randomuser.me',
      'assets2.ignimgs.com',
      'static.wikia.nocookie.net',
      's3.r29static.com',
      'kali-connect.s3.us-west-1.amazonaws.com',
      'miyaa.s3.amazonaws.com',
      'miyaa.s3.us-east-1.amazonaws.com',
      'loremflickr.com',
      'trablisa.s3.us-west-1.amazonaws.com',
      'isomorphic-furyroad.s3.amazonaws.com',
      'cedreo.com',
      'encrypted-tbn2.gstatic.com',
      's10.s3c.es',
      'trablisa-assets.s3.eu-south-2.amazonaws.com'
    ],
  },
  ...(process.env.APPLICATION_MODE === 'production' && {
    // Additional configurations for production mode
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  }),
}

module.exports = nextConfig
