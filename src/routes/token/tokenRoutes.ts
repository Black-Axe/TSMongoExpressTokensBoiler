import express from 'express';
import { getTokenFromRefreshToken, getTokenFromEmailPass } from '../../controllers/token/tokenController';
import { LoginValidation } from '../../middleware/validation/LoginValidation';
import loginMiddleWare from '../../middleware/login/loginMiddleWare';
import refreshMiddleWare from '../../middleware/refreshTokenMiddleware';

const router = express.Router();
//@route post /token
//@desc get new token
//@access public
router.post("/", LoginValidation, loginMiddleWare, getTokenFromEmailPass);

//@route post /token/refresh
//@desc get new token
//@access private (refresh token)
router.post("/refresh", refreshMiddleWare, getTokenFromRefreshToken);

export default router;