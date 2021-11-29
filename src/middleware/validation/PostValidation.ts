// middleware for our functions to use to check if fields exist
import { check } from "express-validator/check";
export const PostValidation = [
    check("title", "Title is required").not().isEmpty(),
    check("content", "Content is required").not().isEmpty()
]

  