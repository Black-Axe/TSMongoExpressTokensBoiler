import { Document, Model, model, Schema } from "mongoose";
import User, {IUser} from "../User/User";

/**
 * Interface to model the Post Schema for TypeScript.
 * @param title:string
 * @param content:string
 * @param author: ref => User._id
 * @param createdAt:Date
 * @param updatedAt:Date
 */
export interface IPost extends Document {
  title: string;
  content: string;
  author: IUser["_id"];
  createdAt: Date;
  updatedAt: Date;
  
}

const postSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }, 
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {    
        type: Date,
        default: Date.now
    }
});

//save to user collection
postSchema.post('save', function(doc, next) {
    User.findById(doc.author, function(err:any, user:IUser) {
        if (err) {
            return next(err);
        }
        user.posts.push(doc);
        user.save(function( err:any , user:IUser) {
            if (err) {
                return next(err);
            }
            next();
        });
    });
});

//remove from user collection
postSchema.post('remove', function(doc, next) {
    User.findById(doc.author, function(err:any, user:IUser) {
        if (err) {
            return next(err);
        }
    User.findByIdAndUpdate(doc.author, {$pull: {posts: doc._id}}, function(err:any, user:IUser) {
        if (err) {
            return next(err);
        }
        next();
    });
    });
});



const Post = model<IPost>("Post", postSchema);

export default Post;