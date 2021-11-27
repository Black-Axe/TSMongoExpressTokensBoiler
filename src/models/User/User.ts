import { Document, Model, model, Schema } from "mongoose";
import { IUserType } from "../UserType/UserType";
import UserType from "../UserType/UserType"

/**
 * Interface to model the User Schema for TypeScript.
 * @param email:string
 * @param password:string
 * @param avatar:string
 * @param userType: ref => UserType._id
 */
export interface IUser extends Document {
  email: string;
  password: string;
  avatar: string;
  userType: IUserType["_id"];
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
   
  date: {
    type: Date,
    default: Date.now
  }
});


const User = model<IUser>("User", userSchema);

export default User;