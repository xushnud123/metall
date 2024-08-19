/** @type {import('next').NextConfig} */

import withPWA from "next-pwa";

const config = withPWA({
  dest: "public",
});

export default config;
