
/**
 * @param message:string
 * @param valid: boolean
 * @param user: IUser
 * @param accessToken: string
 * @param refreshToken: string
 * @param accessTokenExpiration: Date
 * @param refreshTokenExpiration: Date
 */

import { IUser } from "../models/User/User";

 interface IRefreshValidator {
     valid?: boolean;
     message?: string;
     user: IUser,
     accessToken: string,
    refreshToken: string,
    accessTokenExpiration?: Date,
    refreshTokenExpiration?: Date
     
 }
 export default IRefreshValidator;