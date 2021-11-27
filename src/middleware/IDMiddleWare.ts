// middleware for our functions to use to check if valid mongoose id

import mongoose from "mongoose";
import {Response, NextFunction} from "express";
import Request from "../types/Request";

export default function IDMiddleWare(req: Request, res: Response, next: NextFunction) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            error: "Invalid ID"
        });
    }
    next();
}
