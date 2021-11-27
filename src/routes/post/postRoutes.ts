
import express from 'express';
import {createPost, viewPosts, viewPost} from '../../controllers/post/postController';
import { PostMiddleWare } from "../../middleware/PostMiddleWare";
import IDMiddleWare from '../../middleware/IDMiddleWare';
import auth from "../../middleware/auth";

const router = express.Router();

// @route   POST posts
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  private
router.post('/', auth, PostMiddleWare, createPost);

router.get('/', auth, viewPosts);

router.get('/:id', auth, IDMiddleWare, viewPost);



export default router;