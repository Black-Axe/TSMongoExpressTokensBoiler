import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../../User/User";
import { IRefreshToken } from "../RefreshToken/RefreshToken";

/**
 * Interface to model the AccessToken Schema for TypeScript.
 * @param token:string
 * @param user: ref => User._id
 * @param expiration:Date 
 * @param createdAt:Date
 * @param updatedAt:Date
 * @param refreshToken: ref => RefreshToken._id
 * @param history: string[]
 * 
 */
 export interface IAccessToken extends Document {
     token: string;
     user: IUser["_id"];
     expiration: Date;
     createdAt: Date;
     updatedAt: Date;
     refreshToken: IRefreshToken["_id"];
     history: string[];
}

const AccessTokenSchema = new Schema({
  token: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
    expiration: Date,
    createdAt: Date,
    updatedAt: Date,
    refreshToken: {
        type: Schema.Types.ObjectId,
        ref: "RefreshToken",
    },
    history: [String],
});



const AccessToken = mongoose.model("AccessToken", AccessTokenSchema);

export default AccessToken;