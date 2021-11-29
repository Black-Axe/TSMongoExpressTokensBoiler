// middleware for our functions to use to check if fields exist
import { check } from "express-validator/check";
export const UserRegisterValidation = [
    check("email", "Email is required").not().isEmpty().isEmail().withMessage("Email is invalid format"),
    check("password", "Password is required").not().isEmpty().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    check("passwordConfirm", "Password confirmation is required").not().isEmpty().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password confirmation does not match password");
        }
        return true;
    })
  ]

  