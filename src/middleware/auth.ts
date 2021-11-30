import { Response, NextFunction } from "express";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";

import Payload from "../types/IPayload";
import Request from "Request";

import findTokenLocation from "../helpers/token/findTokenLocation";
import User from "../models/User/User";
import config from "../../config/defaults";

const jwtSecretToken: string  = config.jwtSecret;

export default async function(req: Request, res: Response, next: NextFunction) {

    //checks params and headers and cookies for token
  const params = req.params.tokenID;  
  let token:string|null = findTokenLocation(req, params);

  
  if(!token){
    return res.status(HttpStatusCodes.BAD_REQUEST).json({errors: [{msg: "No token found in request"}]
    });
  }
    try {
        const payload: Payload | any = jwt.verify(token, jwtSecretToken);
        let id: string = payload.user._id;

        //transfer payload to request object
        req.userId = id;
        req.token = token;
        //convert expiresIn to date
        let expiresAt = new Date(payload.exp * 1000).toLocaleString();
        
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
                    msg: error.message == "jwt expired" ? "Token expired make request with refresh token for new one. Or please login again" : "invalid token"
                }
            ]
        });
    }



}