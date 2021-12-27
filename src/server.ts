import bodyParser from "body-parser";
import express from "express";
import cookieParser from "cookie-parser";
import {initAndPopulateDB} from "./database/initAndPopulateDB";
import initRouter from "./routes/initRouter";

const app = express();

initAndPopulateDB();

app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


initRouter(app);

const port = app.get("port");
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

export default server;