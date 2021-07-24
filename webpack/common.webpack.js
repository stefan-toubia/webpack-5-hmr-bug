const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const _ = require("lodash");
const pkg = require("../package.json");

const buildPath = path.resolve(__dirname, "../build");
const webpackPath = path.resolve(buildPath, "webpack");
const srcPath = path.resolve(__dirname, "../src");

const production = process.env.NODE_ENV === "production";

const entryNames = [
  {
    name: "webpack-test",
    entryPath: "index.js",
    outputPath: "index.html",
    templatePath: "index.ejs",
  },
];

const cssLoader = {
  loader: "css-loader",
  options: {
    sourceMap: true,
  },
};

const cssExtractLoader = production
  ? MiniCssExtractPlugin.loader
  : "style-loader";

const lessLoader = {
  loader: "less-loader",
  options: {
    sourceMap: true,
    javascriptEnabled: true,
  },
};

const sources = [
  { test: /\.jsx?$/, loader: "jsx" },
  { test: /\.tsx?$/, loader: "tsx" },
];

module.exports = {
  entry: _.mapValues(_.keyBy(entryNames, "name"), ({ entryPath }) =>
    path.resolve(srcPath, entryPath)
  ),
  module: {
    rules: [
      ...sources.map(({ test, loader }) => ({
        test,
        include: [
          path.resolve(__dirname, "../src"),
        ],
        exclude: production ? undefined : /node_modules/,
        loader: "esbuild-loader",
        options: {
          loader,
          target: "es2015",
        },
      })),
      {
        test: /\.less$/,
        include: [srcPath],
        use: [cssExtractLoader, cssLoader, lessLoader],
      },
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, "../node_modules")],
        use: [cssExtractLoader, cssLoader],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        loader: "file-loader",
        options: {
          name: "images/[name].[ext]",
        },
      },
    ],
  },
  output: {
    filename: `webpack/js/[name]-[chunkhash].js`,
    chunkFilename: "webpack/js/[name]-[chunkhash].js",
    assetModuleFilename: "assets/[name]-[hash][ext][query]",
    path: buildPath,
    publicPath: "/static/",
    clean: true,
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.ProvidePlugin({
      _: "lodash",
      moment: "moment",
      process: "process/browser",
    }),
    new MiniCssExtractPlugin({
      filename: `webpack/css/[name]${production ? "-[contenthash]" : ""}.css`,
      ignoreOrder: true,
    }),
    ..._.map(entryNames, ({ name, outputPath, templatePath }) => {
      return new HTMLWebpackPlugin({
        chunks: [name],
        filename: path.resolve(webpackPath, outputPath),
        template: path.resolve(srcPath, templatePath),
        templateParameters: {
          reactVersion: pkg.dependencies.react,
          reactDomVersion: pkg.dependencies["react-dom"],
        },
      });
    }),

  ],
  stats: {
    children: false,
  },
};
