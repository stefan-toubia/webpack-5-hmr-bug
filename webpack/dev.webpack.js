/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require("webpack-merge");
const path = require("path");
const { EnvironmentPlugin } = require("webpack");

const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const common = require("./common.webpack");

const config = merge(common, {
  mode: "development",
  plugins: [
    new EnvironmentPlugin({
      APP_VERSION: "development",
    }),
  ],
  optimization: {
    // Prints more readable module names in the browser console on HMR updates.
    moduleIds: "named",
    // Does not emit compiled assets that include errors.
    emitOnErrors: false,
  },
  // inline-cheap-source-map is much faster for incremental watch builds but it
  // does not identify the original less files.  Use inline-source-map
  // when more precise source-mapping is needed.
  devtool: "inline-cheap-source-map",
  devServer: {
    clientLogLevel: "error",
    disableHostCheck: true,
    hot: true,
    port: 9111,
    writeToDisk: true,
  },
  cache: {
    type: "filesystem",
    // Invalidate cache on build dependency changes.
    // Note that webpack, loaders and all modules referenced from your config are automatically added.
    buildDependencies: {
      config: [__filename, path.join(__dirname, "common.webpack.js")],
    },
  },
});

const smp = new SpeedMeasurePlugin({ disable: !process.env.MEASURE });
module.exports = smp.wrap(config);
