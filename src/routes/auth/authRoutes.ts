
import express from 'express';
import {registerUser, protectedRoute} from '../../controllers/auth/authController';
import { UserRegisterMiddleWare } from "../../middleware/UserRegisterMiddleWare";
import auth from "../../middleware/auth";

const router = express.Router();

// @route   POST auth/user
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
router.post('/', UserRegisterMiddleWare, registerUser);

router.get('/', auth, protectedRoute);
router.get('/:tokenID', auth, protectedRoute);


export default router;