import mongoose, { Document, Model, model, Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import config from "config";
import User, { IUser } from "../User/User";

/**
 * Interface to model the RefreshToken Schema for TypeScript.
 * @param token:string
 * @param user: ref => User._id
 * @param expiryDate:Date 
 * @param createdAt:Date
 * @param updatedAt:Date
 * 
 */
 export interface IRefreshToken extends Document {
  token: string;
  user: IUser["_id"];
  expiryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RefreshTokenSchema = new Schema({
  token: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  expiryDate: Date,
    createdAt: Date,
    updatedAt: Date,
});


RefreshTokenSchema.statics.verifyExpiration = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
}

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

export default RefreshToken;