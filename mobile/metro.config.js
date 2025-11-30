const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true
});

// Exclude web from the resolver
config.resolver.platforms = ["ios", "android", "native"];

module.exports = withNativeWind(config, { input: './global.css' });

