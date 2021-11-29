import { validationResult } from "express-validator/check";
import { Response,  } from "express";
import HttpStatusCodes from "http-status-codes";
import Request from "../../types/Request";
import Post, {IPost} from "../../models/Post/Post";

//@route POST post
//@desc Create a post
//@access private
export const createPost = async (req: Request, res: Response) => {
     const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: errors.array() });
        }
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: [{ msg: "Please fill in all fields" }] });
        }
        try {
            const newPost:IPost = new Post({
                title,
                content,
                author: req.userId
            });
            const post = await newPost.save();
            res.json(post);
        }
        catch (error) {
            console.error(error.message);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server error");
        }

}    


//@route GET posts
//@desc Get all users posts from middleware
//@access private
export const viewPosts = async (req: Request, res: Response) => {
    //console.log(req.userId);
    //res.json({ msg: "view posts for " + req.userId  });
    //get all posts for a user
    let userId = req.userId;
    try {
        const posts = await Post.find({ author: userId }).sort({ date: -1 });
        res.json(posts);
    }
    catch (error) {
        console.error(error.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server error");
    }
}

//@route GET posts/:id
//@desc Get a single post
//@access private
export const viewPost = async (req: Request, res: Response) => {
    //console.log(req.userId);
    //res.json({ msg: "view post for " + req.userId  });
    //get a single post
    let userId = req.userId;
    let postId = req.params.id;
    try {
        const post = await Post.findOne({ _id: postId});
        if (!post) {
            return res.status(HttpStatusCodes.NOT_FOUND).json({ msg: "Post not found" });
        }
        res.json(post);
    }
    catch (error) {
        console.error(error.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server error");
    }
}
