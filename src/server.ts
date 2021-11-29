import bodyParser from "body-parser";
import express from "express";
import authRoutes from "./routes/auth/authRoutes";
import postRoutes from "./routes/post/postRoutes";
import tokenRoutes from "./routes/token/tokenRoutes";
import registerRoutes from "./routes/register/registerRoutes";
import crypto from "crypto";

import {initAndPopulateDB} from "./database/initAndPopulateDB";



const app = express();

initAndPopulateDB();

let cryptoToken = crypto.randomBytes(50).toString("hex");

console.log(cryptoToken);

app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



// @route   GET /
// @desc    Test Base API
// @access  Public
app.get("/", (_req, res) => {
  res.send("API Runninng");
});

app.use("/register", registerRoutes);
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/token", tokenRoutes);

const port = app.get("port");
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

export default server;