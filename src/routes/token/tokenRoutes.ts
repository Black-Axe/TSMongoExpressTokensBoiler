import express from 'express';
import { getTokenFromEmailPass } from "../..//controllers/auth/authController";


const router = express.Router();
//@route post /token
//@desc get new token
//@access public
router.post("/", getTokenFromEmailPass);

export default router;