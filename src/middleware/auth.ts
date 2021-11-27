import config from "config";
import { Response, NextFunction } from "express";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";

import Payload from "../types/Payload";
import Request from "../types/Request";

import findTokenLocation from "../helpers/findTokenLocation";

export default async function(req: Request, res: Response, next: NextFunction) {

  const params = req.params.tokenID;  
  let token:string|null = findTokenLocation(req, params);
  console.log(token);
  if(!token){
    return res.status(HttpStatusCodes.BAD_REQUEST).json({errors: [{msg: "No token found in request"}]
    });
  }
    try {
        const payload: Payload | any = jwt.verify(token, config.get("jwtSecret"));
        let id: string = payload.user.id;
        req.userId = id;
     //   console.log(req.userId);
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