
import express from 'express';
import {registerUser, protectedRoute} from '../../controllers/auth/authController';
import { UserRegisterMiddleWare } from "../../middleware/UserRegisterMiddleWare";
import auth from "../../middleware/auth";

const router = express.Router();

// @route   POST /auth
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
router.post('/', UserRegisterMiddleWare, registerUser);

//@route GET /auth
//@desc protected route
//@access Private
router.get('/', auth, protectedRoute);

//@route GET /auth/token
//@desc private route using token in params
//@access Private
router.get('/:tokenID', auth, protectedRoute);

export default router;