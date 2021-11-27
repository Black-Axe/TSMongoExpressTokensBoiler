import bcrypt from "bcryptjs";
import { validationResult } from "express-validator/check";
import { Router, Response, Request } from "express";
import HttpStatusCodes from "http-status-codes";
import User, {IUser} from "../../models/User/User";
import jwt from "jsonwebtoken";
import config from "config"
import gravatar from "gravatar";
import {getUserByEmail, IValidationObject} from "../../helpers/validateUser";

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
                token: userValidationObject.token
            });
        }
        const avatar = gravatar.url(email, {
            s: "200",
            r: "pg",
            d: "mm"
        });
        const newUser = new User({
            email,
            password,
            avatar,
            
        });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();

        const payload = {
            user: {
                id: newUser.id
            }
        };
        jwt.sign(
            payload,
            config.get("jwtSecret"),
            {
                expiresIn: config.get("jwtExpiration")
            },
            (err, token) => {
                if (err) throw err;
                res.json({ token,
                    expiresIn: config.get("jwtExpiration"),
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server error");
    }
};


export const protectedRoute = async (req: Request, res: Response) => {
    res.json({ msg: "This is a protected route" });
}
