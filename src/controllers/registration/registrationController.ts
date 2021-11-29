
import {generateHashedPass} from "../../helpers/generatePassword";
import HttpStatusCodes from "http-status-codes";
import User, {IUser} from "../../models/User/User";
import Request from "../../types/Request";
import {Response} from "express";
import jwt from "jsonwebtoken";
import generateAvatar from "../../utils/generateAvatar";
import {generateAccessToken, generateRefreshToken} from "../../helpers/generateToken";
import Payload from "Payload";
import { IRefreshToken } from "../../models/RefreshToken/RefreshToken";
import {generatePayload} from "../../utils/generatePayload";


//@route POST register/
//@desc Register user given their email and password, returns the token upon successful registration
//@access Public
export const registerUserWithEmailPass = async (req: Request, res: Response) => {
    //all errors and validation are handled in middleware
    const { email, password } = req.body;
    try {
        const avatar = generateAvatar();
        const newUser:IUser = new User({email,password,avatar});
        newUser.password = await generateHashedPass(password);
        await newUser.save();
        const payload = generatePayload(newUser);
        let accessToken = generateAccessToken(payload);
        let refreshToken = await generateRefreshToken(newUser) as IRefreshToken;
        let decoded = jwt.decode(accessToken) as Payload;
        res.status(HttpStatusCodes.OK).json({
            accessToken: accessToken,
            accessTokenExpiration: new Date(decoded.exp * 1000).toLocaleString(),
            refreshToken: refreshToken.token,
            refreshTokenExpiration: refreshToken.expiryDate.toLocaleString(),
        });
    } catch (err) {
        console.log("Server error cannot create user");
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server error cannot create user");
    }
};
