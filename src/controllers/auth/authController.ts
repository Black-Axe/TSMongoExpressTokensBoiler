import bcrypt from "bcryptjs";
import { validationResult } from "express-validator/check";
import {Response} from "express";
import HttpStatusCodes from "http-status-codes";
import User from "../../models/User/User";
import jwt from "jsonwebtoken";
import config from "config"
import gravatar from "gravatar";
import {getUserByEmail, IValidationObject} from "../../helpers/validateUser";
import Request from "../../types/Request";


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
        let userValidationObject: IValidationObject = await getUserByEmail(email);
        if (!userValidationObject.isValidUser) {
            console.log(userValidationObject.message);
            console.log(";deeee")
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: [{ msg: userValidationObject.message}],
            });
        }
        const user = userValidationObject.user;
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: [{ msg: "Invalid credentials" }] });  
        }
        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(
            payload,
            config.get("jwtSecret"),
            {
                expiresIn: config.get("jwtExpirationTest")
            },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token,
                    expiresIn: config.get("jwtExpirationTest"),
                    user: {
                        id: user.id,
                        email: user.email,
                    }
                });
            }
        );
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
