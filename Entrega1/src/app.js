const express = require("express");
const app = express();
const indexRouter = require("./routes/index.js");
const { uploader } = require("./utils/utils.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(uploader.single("thumbnail"));

app.use("/api", indexRouter);

const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = app;
