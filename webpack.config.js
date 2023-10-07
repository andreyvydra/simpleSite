const path = require("path");

module.exports = {
    entry: "./js/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.js"
    },
    module: {
        rules: [
            { test: /\.mp3$/, loader: "file-loader"},
            { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
        ]
    }
}