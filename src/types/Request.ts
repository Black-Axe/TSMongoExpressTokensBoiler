import { Request } from "express";
import {IUser} from "../models/User/User"

/**
 * Extended Express Request interface to pass Payload Object to the request. Used by the auth middleware to pass data to the request by token signing (jwt.sign) and token verification (jwt.verify).
 * @param userId:string
 * @param token:string
 * @param expiresAt:string
 * @param expiresIn:string
 * @param refreshToken:string
 */


interface request extends Request {
    refreshToken?: string;
    userId: string;
    token: string;
    expiresAt: string;
    expiresIn: string;
    user: IUser;
}
export default request;