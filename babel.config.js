module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    'hot-updater/babel-plugin',
    'nativewind/babel',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@app': './src/app',
          '@processes': './src/processes',
          '@pages': './src/pages',
          '@widgets': './src/widgets',
          '@features': './src/features',
          '@entities': './src/entities',
          '@shared': './src/shared',
          '@components': './src/components',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};
