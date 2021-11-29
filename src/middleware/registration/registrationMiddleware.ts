import mongoose from "mongoose";
import {Response, NextFunction} from "express";
import Request from "../../types/Request";
import { validationResult } from "express-validator/check";
import HttpStatusCodes from "http-status-codes";
import { IValidator, getUserByEmail } from "../../helpers/validateUser";

export default async function RegistrationMiddleware(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    let { email } = req.body;
    let validator: IValidator = await getUserByEmail(email);
    if (validator.isValidUser) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: [{ msg: validator.message}],
        })
    }
    next();
}