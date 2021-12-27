import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../../User/User";

/**
 * Interface to model the RefreshToken Schema for TypeScript.
 * @param token:string
 * @param user: ref => User._id
 * @param expiration:Date 
 * @param createdAt:Date
 * @param updatedAt:Date
 * @param valid: boolean
 * 
 */
 export interface IRefreshToken extends Document {
  token: string;
  user: IUser["_id"];
  expiration: Date;
  createdAt: Date;
  updatedAt: Date;
  valid: boolean;
  history: string[];
}

const RefreshTokenSchema = new Schema({
  token: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  expiration: Date,
    createdAt: Date,
    updatedAt: Date,
    valid: {
      type: Boolean, 
      default: true,
  },
  history: [String],
 });


RefreshTokenSchema.statics.verifyExpiration = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
}

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

export default RefreshToken;