import { findRefreshTokenLocation } from '../helpers/findTokenLocation';
import { Response, NextFunction } from "express";
import HttpStatusCodes from "http-status-codes";
import Request from "../types/Request";
import User from "../models/User/User";


export default async function(req: Request, res: Response, next: NextFunction) {
    const params = req.params.tokenID;
    let token:String|null = findRefreshTokenLocation(req, params);
    if(!token) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
            message: "Invalid token"
        });
        return;
    }
}
    // finish this  