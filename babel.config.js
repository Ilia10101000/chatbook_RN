module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo", ],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          envName: "API",
          moduleName: "@env",
          path: "./env",
          blocklist: null,
          allowlist: null,
          safe: false,
          allowUndefined: false,
          verbose: false,
        },
      ],
    ],
    env: {
      production: {
        plugins: ["react-native-paper/babel"],
      },
    },
  };
};
