import { NextFunction, Response} from "express";
import { validationResult } from "express-validator/check";
import { IValidator, getUserByEmail } from "../../helpers/validateUser";
import Request from "../../types/Request";
import  HttpStatusCodes  from "http-status-codes";
import bcrypt from "bcryptjs";

export default async function loginMiddleWare(req: Request, res: Response, next: NextFunction) {

const errors = validationResult(req);
if (!errors.isEmpty()) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: errors.array() });
}


const { email, password } = req.body;
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
    req.user = user;
    next();
} catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server error");
}
};
    