
import bcrypt from "bcryptjs";
import {generateHashedPass} from "../../helpers/generatePassword";
import { validationResult } from "express-validator/check";
import  config  from "config";
import { IValidationObject, getUserByEmail } from "../../helpers/validateUser";
import HttpStatusCodes from "http-status-codes";
import User from "../../models/User/User";
import Request from "../../types/Request";
import {Response} from "express";
import jwt from "jsonwebtoken";
import generateAvatar from "../../utils/generateAvatar";
import {generateAccessToken, generateRefreshToken} from "../../helpers/generateToken";
import Payload from "Payload";
import { IRefreshToken } from "../../models/RefreshToken/RefreshToken";


//@route POST auth/user
//@desc Register user given their email and password, returns the token upon successful registration
//@access Public
export const registerUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: [{ msg: "Please enter all fields" }] });
    }
    try {
        let userValidationObject: IValidationObject = await getUserByEmail(email);
        if (userValidationObject.isValidUser) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: [{ msg: userValidationObject.message}],
                
            });
        }
        const avatar = generateAvatar();
        const newUser = new User({
            email,
            password,
            avatar 
        });
        newUser.password = await generateHashedPass(password);
        await newUser.save();
        const payload = {
            user: {
                id: newUser.id
            }
        };
        let accessToken = generateAccessToken(payload);
        let refreshToken = await generateRefreshToken(newUser) as IRefreshToken;
        console.log(refreshToken)
        console.log(accessToken)
        let decoded = jwt.decode(accessToken) as Payload;
        console.log(decoded)
        res.status(HttpStatusCodes.OK).json({
            accessToken: accessToken,
            accessTokenExpiration: new Date(decoded.exp * 1000).toLocaleString(),
            refreshToken: refreshToken.token,
            refreshTokenExpiration: refreshToken.expiryDate.toLocaleString(),
        });
    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server error");
    }
};
