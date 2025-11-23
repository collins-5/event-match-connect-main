const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true
});

// Exclude web from the resolver
config.resolver.platforms = ["ios", "android", "native"];

module.exports = config;

