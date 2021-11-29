import bcrypt from "bcryptjs";
import { validationResult } from "express-validator/check";
import {Response} from "express";
import HttpStatusCodes from "http-status-codes";
import User from "../../models/User/User";
import jwt from "jsonwebtoken";
import config from "config"
import gravatar from "gravatar";
import {getUserByEmail, IValidationObject} from "../../helpers/validateUser";
import Request from "../../types/Request";


export const getTokenFromRefreshToken = async (req: Request, res: Response) => {
    console.log(req.cookies)
  /*
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    */
    const { refreshToken } = req.body;
    console.log(refreshToken)
    res.send("ok")
};




