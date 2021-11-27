import config from "config";
import { Response, NextFunction } from "express";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";

import Payload from "../types/Payload";
import Request from "../types/Request";

import findTokenLocation from "../helpers/findTokenLocation";

export default function(req: Request, res: Response, next: NextFunction) {

  const params = req.params.tokenID;  
  let token:string|null = findTokenLocation(req, params);
  if(!token){
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
            {
                msg: "No token found in request"
            }
        ]
    });
    }
    try {
        const payload: Payload | any = jwt.verify(token, config.get("jwtSecret"));
        req.userId = payload.userId;
        next();
    } catch (error) {
        return res.status(HttpStatusCodes.UNAUTHORIZED).json({
            errors: [
                {
                    msg: "Invalid token"
                }
            ]
        });
    }



}