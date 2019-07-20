const path = require("path");

const webpackMerge = require("webpack-merge");

const webpackBaseConfig = require("./webpack.base.config");

module.exports = webpackMerge(webpackBaseConfig, {
  entry: path.resolve(__dirname, "../server/index.prod.js"),
  output: {
    filename: "index.js",
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, "../../../dist/app"),
  },
  target: "node",
});
