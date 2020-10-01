const express = require("express");
const mongoose = require("mongoose");
const mongojs = require("mongojs");
const logger = require("morgan");
const path = require("path");

const PORT = process.env.PORT || 3000;

const db = require("./models");
app.use(require("./routes/view"))
app.js(require("./routes/api"))

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true })


app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});