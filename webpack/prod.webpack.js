/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require("webpack-merge");
const { EnvironmentPlugin } = require("webpack");
const { ESBuildMinifyPlugin } = require("esbuild-loader");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const common = require("./common.webpack");

const config = merge(
  {
    mode: "production",
    externals: {
      react: "React",
      "react-dom": "ReactDOM",
    },
    optimization: {
      moduleIds: "deterministic",
      minimizer: [
        new ESBuildMinifyPlugin({
          target: "es2015",
        }),
        new CssMinimizerPlugin({ parallel: true }),
      ],
      runtimeChunk: {
        name: "manifest",
      },
    },
    devtool: "source-map",
    plugins: [
      new EnvironmentPlugin({
        APP_VERSION: null,
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        openAnalyzer: false,
      }),
    ],
  },
  common
);

const smp = new SpeedMeasurePlugin();
module.exports = smp.wrap(config);
