import express from 'express';
import { getTokenFromEmailPass } from "../../controllers/auth/authController";
import { getTokenFromRefreshToken } from '../../controllers/token/tokenController';
import auth from "../../middleware/auth";


const router = express.Router();
//@route post /token
//@desc get new token
//@access public
router.post("/", getTokenFromEmailPass);

router.post("/refresh", auth, getTokenFromRefreshToken);

export default router;