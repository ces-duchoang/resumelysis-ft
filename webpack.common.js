const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const darkTheme = require("@ant-design/dark-theme");

module.exports = {
  entry: "./app/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.bundle.js"
  },
  node: {
    net: "empty",
    tls: "empty",
    dns: "empty"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-proposal-object-rest-spread"]
          }
        }
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true,
              modifyVars: darkTheme
            }
          }
        ]
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader"
          },
          {
            loader: "resolve-url-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: "file-loader"
          }
        ]
      },
      {
        test: /\.(ico)$/,
        use: "file-loader?name=[name].[ext]"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin({
      title: "My App",
      favicon: path.resolve(__dirname, "public", "favicon.ico"),
      template: path.resolve(__dirname, "public", "index.html"),
      filename: path.resolve(__dirname, "build", "index.html")
    }),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, "public", "_redirects"),
        to: path.resolve(__dirname, "build"),
        toType: "dir"
      }
    ])
  ]
};
