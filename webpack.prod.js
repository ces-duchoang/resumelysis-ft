const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { DefinePlugin } = require("webpack");
require("dotenv").config();

module.exports = merge(common, {
  mode: "production",
  optimization: {
    minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
    splitChunks: {
      chunks: "all",
      minSize: 10000,
      maxSize: 250000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: ".",
      automaticNameMaxLength: 30,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: 1
        },
        default: {
          minChunks: 2,
          priority: 0,
          reuseExistingChunk: true
        },
        name: "vendors"
      }
    }
  },
  plugins: [
    new DefinePlugin({
      API_BASE_DOMAIN: JSON.stringify(process.env.API_BASE_DOMAIN)
    })
  ]
});
