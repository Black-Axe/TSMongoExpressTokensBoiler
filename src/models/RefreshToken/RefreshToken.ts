import mongoose from "mongoose"; 
import { v4 as uuidv4 } from 'uuid';
import config from "config";
import User, { IUser } from "../User/User";

const jwtRefreshExpiration: number = config.get("jwtRefreshExpirationTest");

const RefreshTokenSchema = new mongoose.Schema({
  token: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  expiryDate: Date,
});

RefreshTokenSchema.statics.createToken = async function (user:IUser) {
  let expiredAt = new Date();
  expiredAt.setSeconds(
    expiredAt.getSeconds() + jwtRefreshExpiration
  );
  let _token = uuidv4();
  let _object = new this({
    token: _token,
    user: user._id,
    expiryDate: expiredAt.getTime(),
  });

  console.log(_object);

  let refreshToken = await _object.save();

  return refreshToken.token;
};

RefreshTokenSchema.statics.verifyExpiration = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
}

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

export default RefreshToken;