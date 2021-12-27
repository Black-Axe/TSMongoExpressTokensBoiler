import authRoutes from "./auth/authRoutes";
import postRoutes from "./post/postRoutes";
import registerRoutes from "./register/registerRoutes";
import tokenRoutes from "./token/tokenRoutes";

import express from "express";

export default function initRouter(app: express.Application) {
    app.get("/", (_req, res) => {
               res.send("API Runninng");
    });        
    app.use("/register", registerRoutes);
    app.use("/auth", authRoutes);
    app.use("/posts", postRoutes);
    app.use("/token", tokenRoutes);
}