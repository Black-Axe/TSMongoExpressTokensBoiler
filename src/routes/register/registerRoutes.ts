


import express from 'express';
import {registerUserWithEmailPass} from "../../controllers/registration/registrationController";
import { UserRegisterValidation } from "../../middleware/validation/UserRegisterValidation";
import RegistrationMiddleware from "../../middleware/Registration/RegistrationMiddleware";
const router = express.Router();

// @route   POST /register
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
router.post('/', UserRegisterValidation, RegistrationMiddleware, registerUserWithEmailPass);

router.get("/", (req, res) => {
    res.send("Hello")
});
export default router;