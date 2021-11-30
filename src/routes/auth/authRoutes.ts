
import express from 'express';
import {protectedRoute} from '../../controllers/auth/authController';
import auth from "../../middleware/auth";

const router = express.Router();


//@route GET /auth
//@desc protected route
//@access Private
router.get('/', auth, protectedRoute);

//@route post /auth/token
//@desc private route using token in params
//@access Private
router.post('/:tokenID', auth, protectedRoute);

export default router;