module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        'react-native-reanimated/plugin', // deve essere l'ULTIMO plugin
      ],
    };
  };
  