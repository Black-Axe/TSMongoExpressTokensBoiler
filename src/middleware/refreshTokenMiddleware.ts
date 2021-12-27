import { findRefreshTokenLocation } from '../helpers/token/findTokenLocation';
import { Response, NextFunction } from "express";
import HttpStatusCodes from "http-status-codes";
import Request from "Request";


export default async function refreshMiddleWare(req: Request, res: Response, next: NextFunction) {
    const params = req.params.tokenID;
    let token:string|null = findRefreshTokenLocation(req, params);
    if(!token) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
            message: "No refresh token found"
        });
    }

    // attach refresh token to the request
    req.refreshToken = token;
    
    next();

}
    // finish this  