import {Response} from "express";
import { generatePayload } from "../../utils/generatePayload";
import Request from "Request";
import HttpStatusCodes from "http-status-codes";
import { IUser } from "../../models/User/User";
import { generateAccessTokenFromRefreshToken, generateTokens } from "../../services/TokenService";
import IGrandToken from "IGrandToken";
import IRefreshValidator from "IRefreshValidator";
import { findRefreshTokenLocation } from "../../helpers/token/findTokenLocation";

export const getTokenFromRefreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.refreshToken;
    let refreshTokenValidator = await generateAccessTokenFromRefreshToken(refreshToken) as IRefreshValidator;
    if (refreshTokenValidator.valid) {
        res.status(HttpStatusCodes.OK).json({
            accessToken: refreshTokenValidator.accessToken,
            msg: "Refresh token consumed. To get a new refresh token please authenticate"
        });
    }
    else {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
            msg: refreshTokenValidator.message
        });
    }
};

//@route POST /token
//@desc Login user and return new or updated JWT tokens
//@access Public
export const getTokenFromEmailPass = async (req: Request, res: Response) => {
    //middleware handles the validation of the user and credentials
    //token will either be retrieved or a new one will be generated
  try {
      const user: IUser = req.user;
      let grandToken: IGrandToken = await generateTokens(user);
      res.status(HttpStatusCodes.OK).json(grandToken);

  } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server error");
  }

};