
import {generateHashedPass} from "../../helpers/user/generatePassword";
import HttpStatusCodes from "http-status-codes";
import User, {IUser} from "../../models/User/User";
import Request from "../../types/Request";
import {Response} from "express";
import jwt from "jsonwebtoken";
import generateAvatar from "../../utils/generateAvatar";
import { generateTokens } from "../../services/TokenService";
import Payload from "IPayload";
import { IRefreshToken } from "../../models/Token/RefreshToken/RefreshToken";
import {generatePayload} from "../../utils/generatePayload";
import IGrandToken from "IGrandToken";


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
        let grandToken: IGrandToken = await generateTokens(newUser);
        res.status(HttpStatusCodes.OK).json(grandToken);
    } catch (err) {
        console.log("Server error cannot create user");
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server error cannot create user");
    }
};
