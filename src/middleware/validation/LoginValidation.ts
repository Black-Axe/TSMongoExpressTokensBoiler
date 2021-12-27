// middleware for our functions to use to check if fields exist
import { check } from "express-validator";
export const LoginValidation = [
    check("email", "Email is required").not().isEmpty().isEmail().withMessage("Email is invalid format"),
    check("password", "Password is required").not().isEmpty()
  ]

  