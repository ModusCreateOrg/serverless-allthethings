const path = require("path");

const postcssPresetEnv = require("postcss-preset-env");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const webpackBaseConfig = require("./webpack.base.config");

const plugins = [
  new VueLoaderPlugin(),
  new webpack.DefinePlugin({
    "process.env.VUE_ENV": JSON.stringify("server"),
  }),
  // Export the Vue SSR server bundle to a temporary location so that it can be imported into the lambda bundle (in ../lambda.js)
  new VueSSRServerPlugin({
    filename: "../tmp/app/vue-ssr-server-bundle.json",
  }),
];

module.exports = webpackMerge(webpackBaseConfig, {
  entry: path.resolve(__dirname, "../entry.server.js"),
  module: {
    rules: [
      {
        loader: "vue-loader",
        options: {
          preserveWhitespace: false,
        },
        test: /\.vue$/,
      },
      {
        exclude: (file) => /node_modules/.test(file) && !/\.vue\.js/.test(file),
        loader: "babel-loader",
        test: /\.js$/,
      },
      {
        loader: "file-loader",
        options: {
          name: "[name].[hash].[ext]",
          publicPath: "/assets/",
        },
        test: /\.(png|jpg|gif|svg)$/,
      },
      {
        test: /\.scss$/,
        use: [
          "vue-style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: () => [postcssPresetEnv()],
            },
          },
          `sass-loader${
            process.env.NODE_ENV !== "development"
              ? "?outputStyle=compressed"
              : ""
          }`,
        ],
      },
    ],
  },
  output: {
    filename: "server-bundle.js",
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, "../../../dist/app"),
  },
  plugins,
  target: "node",
});
