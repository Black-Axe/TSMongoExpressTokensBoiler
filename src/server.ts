import bodyParser from "body-parser";
import express from "express";
import authRoutes from "./routes/auth/authRoutes";
import postRoutes from "./routes/post/postRoutes";

import {initAndPopulateDB} from "./database/initAndPopulateDB";


const app = express();

initAndPopulateDB();

app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



// @route   GET /
// @desc    Test Base API
// @access  Public
app.get("/", (_req, res) => {
  res.send("API Runninng");
});


app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

const port = app.get("port");
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

export default server;