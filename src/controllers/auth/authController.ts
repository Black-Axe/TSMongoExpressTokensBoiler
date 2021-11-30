import {Response} from "express";
import Request from "../../types/Request";



export const protectedRoute = async (req: Request, res: Response) => {
    //console.log(req.userId);
    res.json({ msg: "This is a protected route userId " + req.userId,
        user: req.userId,
        token: req.token,
        expiresIn: req.expiresIn,
        expiresAt: req.expiresAt
    });

}