
/**
 * @param message:string
 * @param valid: boolean
 * @param user: IUser
 * @param token: string
 */

import { IUser } from "../models/User/User";

 interface IRefreshValidator {
     valid?: boolean;
     message?: string;
     user: IUser,
     accessToken: string,
     
 }
 export default IRefreshValidator;