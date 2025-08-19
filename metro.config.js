const path = require('path');

const { getDefaultConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = [...config.resolver.sourceExts, 'env', 'css'];

module.exports = withNativeWind(config, {
  input: path.resolve(__dirname, 'global.css'),
});
