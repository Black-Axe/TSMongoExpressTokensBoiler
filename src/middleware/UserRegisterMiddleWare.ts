// middleware for our functions to use to check if fields exist
import { check } from "express-validator/check";
export const UserRegisterMiddleWare = [
    check("email", "Email is required").not().isEmpty().isEmail().withMessage("Email is invalid format"),
    check("password", "Password is required").not().isEmpty().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
  ]

  