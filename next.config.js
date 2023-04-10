// // @ts-check
// /**
//  * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
//  * This is especially useful for Docker builds.
//  */
// !process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));
//
// import withBundleAnalyzer from '@next/bundle-analyzer';
//
// /** @type {import("next").NextConfig} */
// const config = {
//   reactStrictMode: true,
//   /* If trying out the experimental appDir, comment the i18n config out
//    * @see https://github.com/vercel/next.js/issues/41980 */
//   i18n: {
//     locales: ["en"],
//     defaultLocale: "en",
//   },
//     typescript:{
//         ignoreBuildErrors:true
//     }   
// };
// // export default config;
// export default withBundleAnalyzer({
//   enabled: process.env.ANALYZE === 'true',
// })(config);
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
    typescript:{
        ignoreBuildErrors:true
    }
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer(nextConfig)
