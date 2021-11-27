
import express from 'express';
import {registerUser} from '../../controllers/auth/authController';
import { UserRegisterMiddleWare } from "../../middleware/UserRegisterMiddleWare";
import auth from "../../middleware/auth";

const router = express.Router();

// @route   POST auth/user
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
router.post('/', UserRegisterMiddleWare, registerUser);

router.get('/', auth, (req, res) => {
    res.json({
        msg: 'Auth route'
    });
});
router.get('/:tokenID', auth, (req, res) => {
    res.json({
        msg: 'Auth route'
    });
});


export default router;