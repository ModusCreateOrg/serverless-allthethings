const path = require("path");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssPresetEnv = require("postcss-preset-env");
const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const webpackBaseConfig = require("./webpack.base.config");

const plugins = [
  new VueLoaderPlugin(),
  new MiniCssExtractPlugin({
    filename: "[name].[contenthash].css",
  }),
  new webpack.DefinePlugin({
    "process.env.VUE_ENV": JSON.stringify("client"),
  }),
  // Export the Vue SSR client manifest to a temporary location so that it can be imported into the lambda bundle (in ../lambda.js)
  new VueSSRClientPlugin({
    filename: "../../tmp/app/vue-ssr-client-manifest.json",
  }),
  new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, "../../static"),
      ignore: ["README.md"],
      to: path.resolve(__dirname, "../../../dist/static"),
    },
  ]),
];

if (process.env.NODE_ENV !== "development") {
  plugins.push(
    ...[
      new SWPrecacheWebpackPlugin({
        cacheId: "serverless-allthethings",
        dontCacheBustUrlsMatching: /./,
        filepath: path.resolve(
          __dirname,
          "../../../dist/static/service-worker.js",
        ),
        mergeStaticsConfig: true,
        minify: true,
        navigateFallback: "/pwa.html",
        navigateFallbackWhitelist: [/^\/pwa$/],
        staticFileGlobs: [
          path.resolve(__dirname, "../../../dist/static/pwa.html"),
        ],
        staticFileGlobsIgnorePatterns: [
          /\/browserconfig\.xml$/,
          /\/logo-.*\.png$/,
          /\/robots\.txt$/,
          /\/safari-pinned-tab\.svg$/,
          /\/site\.webmanifest$/,
          /\/sitemap\.xml$/,
          /\/vue-ssr-client-manifest\.json$/,
        ],
        stripPrefix: path.resolve(__dirname, "../../../dist/static"),
      }),
    ],
  );
}

module.exports = webpackMerge(webpackBaseConfig, {
  entry: {
    app: path.resolve(__dirname, "../entry.client.js"),
  },
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
          process.env.NODE_ENV !== "development"
            ? MiniCssExtractPlugin.loader
            : "vue-style-loader",
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
  optimization: {
    runtimeChunk: {
      name: "runtime",
    },
    splitChunks: {
      chunks: "all",
    },
  },
  output: {
    path: path.resolve(__dirname, "../../../dist/static/assets"),
    publicPath: "/assets/",
  },
  plugins,
});
