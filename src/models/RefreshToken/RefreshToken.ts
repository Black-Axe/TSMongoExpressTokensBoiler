import mongoose, { Document, Model, model, Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import config from "config";
import User, { IUser } from "../User/User";

/**
 * Interface to model the RefreshToken Schema for TypeScript.
 * @param token:string
 * @param user: ref => User._id
 * @param expiryDate:Date 
 */
 export interface IRefreshToken extends Document {
  token: string;
  user: IUser["_id"];
  expiryDate: Date;
}

const jwtRefreshExpiration: number = config.get("jwtRefreshExpirationTest");

const RefreshTokenSchema = new Schema({
  token: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  expiryDate: Date,
});

RefreshTokenSchema.statics.createToken = async function (user:IUser) {
  let expiredAt = new Date();
    expiredAt.setSeconds(
    expiredAt.getSeconds() + jwtRefreshExpiration
  );
  let _tokenID = uuidv4();
  let token = new RefreshToken({
    token: _tokenID,
    user: user._id,
    expiryDate: expiredAt.getTime(),
  });
  let refreshToken = await token.save();

  console.log(refreshToken);
  return refreshToken;
};

RefreshTokenSchema.statics.verifyExpiration = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
}

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

export default RefreshToken;