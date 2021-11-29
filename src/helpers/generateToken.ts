import config from 'config';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User/User';
import RefreshToken, {IRefreshToken} from '../models/RefreshToken/RefreshToken';
import { v4 as uuidv4 } from 'uuid';
import Payload from "Payload";

const refreshTokenExpiration: number = config.get("RefreshTokenExpirationTest");

export function generateAccessToken(payload: object): string {

    return jwt.sign(payload, config.get("jwtSecret"), { expiresIn: config.get("jwtExpirationTest") });
}

export async function generateRefreshToken(user:IUser){
    // make sure user exists and is in db
    const userInDb = await User.findById(user._id);
    if(!userInDb){
        return null;
    }
    let expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + refreshTokenExpiration);
    let _tokenID = uuidv4();

    try{
        const newRefreshToken = new RefreshToken({
            user: user._id,
            token: _tokenID,
            expiryDate: expiredAt,
            createdAt: new Date()
        });
        await newRefreshToken.save();
        return newRefreshToken;
    }catch(err){
        console.log(err);
        return null;
    }
}
