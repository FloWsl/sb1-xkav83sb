module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      // Temporarily comment out the module-resolver to see if it's causing issues
      // [
      //   'module-resolver',
      //   {
      //     root: ['.'],
      //     extensions: [
      //       '.ios.ts',
      //       '.android.ts',
      //       '.ts',
      //       '.ios.tsx',
      //       '.android.tsx',
      //       '.tsx',
      //       '.jsx',
      //       '.js',
      //       '.json',
      //     ],
      //     alias: {
      //       '@': '.',
      //     },
      //   },
      // ],
    ],
  };
};