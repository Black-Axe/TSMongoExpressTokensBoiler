
/**
 * @param user:IUser["_id"]
 * @param accessToken:IAccessToken
 * @param refreshToken:IRefreshToken
 * @param accessTokenExpiration:string
 * @param refreshTokenExpiration:srting
 */

import { IUser } from "../models/User/User";
import { IAccessToken } from "../models/Token/AccessToken/AccessToken";
import { IRefreshToken } from "../models/Token/RefreshToken/RefreshToken";


interface IGrandToken {
    user: IUser["_id"];
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiration: string;
    refreshTokenExpiration: string;
    error?: string;
    
}
export default IGrandToken;