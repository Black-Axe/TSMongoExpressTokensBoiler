import bodyParser from "body-parser";
import express from "express";
import authRoutes from "./routes/auth/authRoutes";
import postRoutes from "./routes/post/postRoutes";
import tokenRoutes from "./routes/token/tokenRoutes";
import registerRoutes from "./routes/register/registerRoutes";
import cookieParser from "cookie-parser";

import {initAndPopulateDB} from "./database/initAndPopulateDB";



const app = express();

initAndPopulateDB();




app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());




// @route   GET /
// @desc    Test Base API
// @access  Public
app.get("/", (_req, res) => {
  res.send("API Runninng");
});

//register user -> defaults to a user type
app.use("/register", registerRoutes);

//authenticated routes
app.use("/auth", authRoutes);

//create posts or view posts
app.use("/posts", postRoutes);

//token routes for access and refresh token
app.use("/token", tokenRoutes);

const port = app.get("port");
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

export default server;