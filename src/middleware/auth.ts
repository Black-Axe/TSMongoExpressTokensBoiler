import config from "config";
import { Response, NextFunction } from "express";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";

import Payload from "../types/Payload";
import Request from "../types/Request";

import findTokenLocation from "../helpers/findTokenLocation";

export default function(req: Request, res: Response, next: NextFunction) {
  // Get token from header
  const token = req.header("x-auth-token") || req.header("x-access-token");
  //get params and check if it is a token
  const params = req.params.tokenID;  
  findTokenLocation(req, params);




  // Check if no token
  if (!token) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: "No token, authorization denied" });
  }
  // Verify token
  try {
    const payload: Payload | any = jwt.verify(token, config.get("jwtSecret"));
    req.userId = payload.userId;
    next();
  } catch (err) {
    res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: "Token is not valid" });
  }
}