import config from "config";
import { Response, NextFunction } from "express";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";

import Payload from "../types/Payload";
import Request from "../types/Request";

import findTokenLocation from "../helpers/findTokenLocation";
import User from "../models/User/User";

export default async function(req: Request, res: Response, next: NextFunction) {

  const params = req.params.tokenID;  
  let token:string|null = findTokenLocation(req, params);
  
  if(!token){
    return res.status(HttpStatusCodes.BAD_REQUEST).json({errors: [{msg: "No token found in request"}]
    });
  }
    try {
       // let decoded = jwt.decode(token, config.get("jwtSecret"));
        const payload: Payload | any = jwt.verify(token, config.get("jwtSecret"));
        let id: string = payload.user.id;
      //  console.log("PAyload")
      //  console.log(payload);
        req.userId = id;
        req.token = token;
        //convert expiresIn to date
        let expiresAt: Date = new Date(payload.exp * 1000);
        req.expiresIn = config.get("jwtExpirationTest");
        req.expiresAt = expiresAt;


        const user = await User.findById(id);
        if (!user) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: [{ msg: "User does not exist" }] });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error.message);
        return res.status(HttpStatusCodes.UNAUTHORIZED).json({
            errors: [
                {
                    msg: error.message == "jwt expired" ? "Token expired" : "invalid token"
                }
            ]
        });
    }



}