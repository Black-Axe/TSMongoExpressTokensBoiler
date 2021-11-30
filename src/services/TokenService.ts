import config from "../../config/defaults";
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User/User';
import RefreshToken, {IRefreshToken} from '../models/Token/RefreshToken/RefreshToken';
import AccessToken, {IAccessToken} from '../models/Token/AccessToken/AccessToken';
import { v4 as uuidv4 } from 'uuid';
import { generatePayload, IPayload } from "../utils/generatePayload";
import IJwtToken from "../types/IPayload";
import IGrandToken from "../types/IGrandToken";
import IRefreshValidator from "IRefreshValidator";
import crypto from 'crypto';

//const REFRESH_EXPIRATION: number = config.RefreshTokenExpirationTest;
const REFRESH_EXPIRATION_DAYS: number = config.RefreshTokenExpirationDays;
const JWT_EXPIRATION: string = config.jwtExpiration;
const jwtSecret: string = config.jwtSecret;

//generates or retrieves access token

export async function generateOrRetrieveAccessToken(user: IUser): Promise<IAccessToken> {
 
    //check for existing access token
    let existingAccessToken: IAccessToken = await retrieveAccessToken(user);
    if(existingAccessToken){
        // if existing access token 
        // check if it has expired
        if(existingAccessToken.expiration < new Date()){
            // if expired, generate new access token
            return await generateAccessToken(user, existingAccessToken);
        }
        // if not expired, return existing access token
        return existingAccessToken;
      }


    //console.log("no existing access token, creating")
    // if no existing access token, generate new access token
    return await generateAccessToken(user);
}

//generates or retrieves refresh token
//if existing refresh token, create new one
export async function generateOrRetrieveRefreshToken(user:IUser){

    //if existing refresh token update it
    let existingRefreshToken = await retrieveRefreshToken(user);
    if(existingRefreshToken){
        // create new refresh token and push old refresh token to history
        let newRefreshToken = await RefreshToken.findOneAndUpdate({user: user._id},
            {$set: {
            token: generateCryptoToken(),
            valid: true,
            expiration: generateExpirationDate(),
            updatedAt: new Date(),
            },
            $push: {history: existingRefreshToken.token}},
            {new: true}
            ) as IRefreshToken;
        return newRefreshToken;
    }

    try{
        const newRefreshToken = new RefreshToken({
            user: user._id,
            token: generateCryptoToken(),
            expiration: generateExpirationDate(),
            createdAt: new Date()
        });
        await newRefreshToken.save();
        return newRefreshToken;
    }catch(err){
        console.log(err);
        return null;
    }
}

export async function retrieveAccessToken(user:IUser){
    // middleware handles the validation of the user and credentials

    // get accessToken from db
    let accessToken = await AccessToken.findOne({user: user._id});
    if(!accessToken){
        //console.log("no access token found")
       return false;
    }
    return accessToken;

}

export async function  retrieveRefreshToken(user:IUser){
    // make sure user exists and is in db
    const userInDb = await User.findById(user._id);
    if(!userInDb){
        return null;
    }
    // get refreshToken from db
    let refreshToken = await RefreshToken.findOne({user: user._id});
    if(!refreshToken){
        return null;
    }
    return refreshToken;
}

export async function generateTokens(user:IUser):Promise<IGrandToken>{
    let accessToken = await generateOrRetrieveAccessToken(user);
    let refreshToken = await generateOrRetrieveRefreshToken(user) as IRefreshToken;

    let accessTokenExpiration = accessToken.expiration.toLocaleString();
    let refreshTokenExpiration = refreshToken.expiration.toLocaleString();
    let grandToken: IGrandToken = {
        user: user._id,
        accessToken: accessToken.token,
        refreshToken: refreshToken.token,
        accessTokenExpiration:  accessTokenExpiration,
        refreshTokenExpiration: refreshTokenExpiration
    }
    return grandToken;
}

//check refresh token is valid
export async function generateTokensFromRefreshToken(refreshToken:string){
   // validate and consume refresh token
   let validator = await validateRefreshToken(refreshToken);
    if(!validator.valid){
        return validator;
    }
    //consume refresh token
    let consumedRefreshToken = consumeRefreshToken(refreshToken);
    if(!consumedRefreshToken){
        return {valid: false, message: "could not consume refresh token"}
    }
    // generate new access token

    //find the user associated with the refresh token
    let user = validator.user;

    // generate new access token
    let accessToken = await generateOrRetrieveAccessToken(user);
    validator.accessToken = accessToken.token;

    //generate new refresh token
    let newRefreshToken = await generateOrRetrieveRefreshToken(user) as IRefreshToken;
    validator.refreshToken = newRefreshToken.token;

    //set expiration dates
    let accessTokenExpiration = accessToken.expiration;
    let refreshTokenExpiration = newRefreshToken.expiration;
    validator.accessTokenExpiration = accessTokenExpiration;
    validator.refreshTokenExpiration = refreshTokenExpiration;
    return validator;



}

 async function validateRefreshToken(refreshToken:string){
     let refreshValidator: IRefreshValidator = {
         valid: false,
         message: "",
            user: null,
        accessToken: null,
        refreshToken: null,
     }
    // get user from refreshToken
    let reToken = await RefreshToken.findOne({token: refreshToken}) as IRefreshToken;
    
    if(!reToken){
        refreshValidator.message = "no refresh token found in db";
        return refreshValidator;
    }
    // check if refresh token is expired or if token is valid
    let valid = reToken.valid;
    if(!valid){
        refreshValidator.message = "refresh token has been used / invalid";
        return refreshValidator;
    }
    if(reToken.expiration < new Date()){
        refreshValidator.message = "refresh token has expired " + reToken.expiration.toLocaleString() + " please authenticate";
        // set refresh token to invalid
        return refreshValidator;
    }
    refreshValidator.valid = true;

    //console.log("refresh token is valid");
    refreshValidator.user = reToken.user;
    return refreshValidator;
}

 async function consumeRefreshToken(refreshToken:string){

    // update refresh token to invalid to reflect it has been used
    let reToken = await RefreshToken.findOneAndUpdate({token: refreshToken}, {valid: false});
    if(!reToken){
        //console.log("no refresh token found in db");
        return false;
    }
    return true;
}

async function generateAccessToken(user:IUser, existingAccessToken?:IAccessToken){

    let payload:IPayload = generatePayload(user);
    let jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: JWT_EXPIRATION });
    let decodedJwtToken = jwt.decode(jwtToken) as IJwtToken;
    let timeExpiration = convertJwtTime(decodedJwtToken.exp);
    //console.log("time expiration: " + timeExpiration);

    // if existing access token, update it
    if(existingAccessToken){
        // update existing access token
        let updatedAccessToken = await AccessToken.findOneAndUpdate({user: user._id},
            {$set: {
                token: jwtToken,
                expiration: timeExpiration,
                updatedAt: new Date(),
            },
            $push: {history: existingAccessToken.token}},
            {new: true}
            ) as IAccessToken;
        return updatedAccessToken;

    }
    
    let accessToken = new AccessToken({
        token: jwtToken,
        user: payload.user,
        expiration: timeExpiration,
        createdAt: new Date(),
        updatedAt: new Date()
            }) as IAccessToken;
    await accessToken.save();

    return accessToken;
}

 function generateExpirationDate(){
    let date = new Date();
    // add days to date
    date.setDate(date.getDate() + REFRESH_EXPIRATION_DAYS);
    //console.log("date: " + date.toLocaleString());
    return date; 
}

 export function convertJwtTime(time: number){
    let date = new Date(time*1000);
    return date.toLocaleString();
}

function generateCryptoToken(){
    let cryptoToken = crypto.randomBytes(5).toString('hex');
    let firstid = uuidv4();
    let secondid = uuidv4();

    let token = "@@rt-"+ firstid + "-" + cryptoToken + "-" + secondid + "@@";
    return token;
}