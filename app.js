// app.js
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
const isProduction = "production" === process.env.NODE_ENV;

// postでdataを受け取る
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// public配下の静的ファイルを公開
app.use("/", express.static("public"));

app.listen(port, () => {
  console.log(`server available on http://localhost:${port}`);
  if (isProduction) {
    const browserSync = require("browser-sync");
    browserSync({
      files: ["public/**/*.{html,js,css}"],
      online: false,
      open: false,
      port: port + 1,
      proxy: `localhost:${port}`,
      ui: false
    });
  }
});
