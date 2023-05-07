require("dotenv").config();
import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import "../scripts/tmdb";

import { console } from "./utils";

import routes from "./routes";

const PORT = Number(process.env.PORT) || 4144;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on 0.0.0.0:${PORT}`);
});
