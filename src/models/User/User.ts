import { Document, model, Schema } from "mongoose";
import { IUserType } from "../UserType/UserType";
import { IPost } from "../Post/Post";
import UserType from "../UserType/UserType"
import userTypes from "../UserType/config";

/**
 * Interface to model the User Schema for TypeScript.
 * @param email:string
 * @param password:string
 * @param avatar:string
 * @param userType: ref => UserType._id
 * @param posts[]: ref => Post._id
 */
export interface IUser extends Document {
  email: string;
  password: string;
  avatar: string;
  userType: IUserType["_id"];
  posts: IPost["_id"][];
}

const userSchema: Schema = new Schema({
  userType: {
    type: Schema.Types.ObjectId,
    ref: 'UserType'
},
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});



userSchema.pre<IUser>("save", async function(next) {
  // set a users userType to the default userType if it is not set
  const userType = await UserType.findOne({ accessRights: userTypes.user });
  if (!this.userType) {
    this.userType = userType._id;
  }
});



const User = model<IUser>("User", userSchema);

export default User;