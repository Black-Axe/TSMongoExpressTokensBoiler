import bcrypt from "bcryptjs";
import { validationResult } from "express-validator/check";
import {Response} from "express";
import HttpStatusCodes from "http-status-codes";
import {getUserByEmail, IValidator} from "../../helpers/validateUser";
import Request from "../../types/Request";
import {generateAccessToken, generateRefreshToken} from "../../helpers/generateToken";
import { IRefreshToken } from "../../models/RefreshToken/RefreshToken";

export const getTokenFromEmailPass = async (req: Request, res: Response) => {
    console.log(req.cookies)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: [{ msg: "Please enter all fields" }] });
    }
    try {
        let userValidator: IValidator = await getUserByEmail(email);
        if (!userValidator.isValidUser) {
            console.log(userValidator.message);
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: [{ msg: userValidator.message}],
            });
        }
        const user = userValidator.user;
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: [{ msg: "Invalid credentials" }] });  
        }
        const payload = {
            user: {
                id: user.id
            }
        };
        let accessToken = generateAccessToken(payload);
        let refreshToken = await generateRefreshToken(user) as IRefreshToken;
        console.log(refreshToken)
        console.log(accessToken)
    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server error");
    }
};

export const protectedRoute = async (req: Request, res: Response) => {
    //console.log(req.userId);
    res.json({ msg: "This is a protected route userId" + req.userId,
        user: req.user,
        token: req.token,
        expiresIn: req.expiresIn,
        expiresAt: req.expiresAt
    });

}