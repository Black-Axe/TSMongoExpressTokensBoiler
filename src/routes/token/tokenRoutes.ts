import express from 'express';
import { getTokenFromRefreshToken, getTokenFromEmailPass } from '../../controllers/token/tokenController';
import auth from "../../middleware/auth";
import { LoginValidation } from '../../middleware/validation/LoginValidation';
import loginMiddleWare from '../..//middleware/login/loginMiddleWare';


const router = express.Router();
//@route post /token
//@desc get new token
//@access public
router.post("/", LoginValidation, loginMiddleWare, getTokenFromEmailPass);

router.post("/refresh", auth, getTokenFromRefreshToken);

export default router;