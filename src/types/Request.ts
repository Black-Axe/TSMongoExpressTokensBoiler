import { Request } from "express";
import {IUser} from "../models/User/User"

/**
 * Extended Express Request interface to pass Payload Object to the request. Used by the auth middleware to pass data to the request by token signing (jwt.sign) and token verification (jwt.verify).
 * @param userId:string
 * @param token:string
 * @param expiresAt:date
 * @param expiresIn:string
 */


interface request extends Request {
    userId: string;
    token: string;
    expiresAt: Date;
    expiresIn: String;
    user: IUser;
}
export default request;