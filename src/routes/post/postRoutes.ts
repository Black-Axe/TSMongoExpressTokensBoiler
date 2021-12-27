import express from 'express';
import {createPost, viewPosts, viewPost} from '../../controllers/post/postController';
import { PostValidation } from "../../middleware/validation/PostValidation";
import IDMiddleWare from '../../middleware/IDMiddleWare';
import auth from "../../middleware/auth";

const router = express.Router();

// @route   POST posts
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  private
router.post('/', auth, PostValidation, createPost);

router.get('/', auth, viewPosts);

router.get('/:id', auth, IDMiddleWare, viewPost);

export default router;