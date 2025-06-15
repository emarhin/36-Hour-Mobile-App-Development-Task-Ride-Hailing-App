// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require("nativewind/metro");

// const config = getDefaultConfig(__dirname);

// module.exports = withNativeWind(config, { input: "./global.css" });
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Start with default config
let config = getDefaultConfig(__dirname);

// 1️⃣ Firebase fix: allow `.cjs` and disable strict exports
config.resolver.sourceExts.push("cjs");
config.resolver.unstable_enablePackageExports = false;

// 2️⃣ NativeWind setup
config = withNativeWind(config, { input: "./global.css" });

module.exports = config;
