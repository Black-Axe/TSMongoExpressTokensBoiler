


import express from 'express';
import {registerUser} from "../../controllers/registration/registrationController";
import { UserRegisterMiddleWare } from "../../middleware/UserRegisterMiddleWare";
const router = express.Router();

// @route   POST /register
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
router.post('/', UserRegisterMiddleWare, registerUser);
export default router;