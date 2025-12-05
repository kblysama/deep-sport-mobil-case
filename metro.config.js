const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver = config.resolver || {};

const shimPath = path.resolve(__dirname, 'src/shims/tfjs-webgpu-empty.js');

config.resolver.alias = {
  ...(config.resolver.alias || {}),
  '@tensorflow/tfjs-backend-webgpu': shimPath,
};

config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  '@tensorflow/tfjs-backend-webgpu': shimPath,
};

module.exports = config;
