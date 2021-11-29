import config from "../../config/defaults";
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User/User';
import RefreshToken, {IRefreshToken} from '../models/RefreshToken/RefreshToken';
import { v4 as uuidv4 } from 'uuid';
import Payload from "Payload";


const REFRESH_EXPIRATION: number = config.RefreshTokenExpirationTest;
const JWT_EXPIRATION: string = config.jwtExpirationTest;
const jwtSecret: string = config.jwtSecret;


export function generateAccessToken(payload: object): string {
    //takes expires in as "2m" for example for 2 minutes
    return jwt.sign(payload, jwtSecret, { expiresIn: JWT_EXPIRATION });
}

export async function generateRefreshToken(user:IUser){
    // make sure user exists and is in db
    const userInDb = await User.findById(user._id);
    if(!userInDb){
        return null;
    }

    // refresh token logic checking
    let expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + REFRESH_EXPIRATION);
    let _tokenID = uuidv4();

    try{
        const newRefreshToken = new RefreshToken({
            user: user._id,
            token: _tokenID,
            expiryDate: expiresAt,
            createdAt: new Date()
        });
        await newRefreshToken.save();
        return newRefreshToken;
    }catch(err){
        console.log(err);
        return null;
    }
}
