//  export default cannot be applied in webpack
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BASE_URL = "./src/client/js/";
module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  entry: {
    main: BASE_URL + "main.js",
    sidebar: BASE_URL + "sidebar.js",
    video: BASE_URL + "video.js",
    comment: BASE_URL + "comment.js",
  },
  mode: "development",
  watch: true,
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
