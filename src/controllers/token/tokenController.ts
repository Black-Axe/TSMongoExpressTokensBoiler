import {Response} from "express";
import Request from "Request";
import HttpStatusCodes from "http-status-codes";
import { IUser } from "../../models/User/User";
import { generateTokensFromRefreshToken, generateTokens } from "../../services/TokenService";
import IGrandToken from "IGrandToken";
import IRefreshValidator from "IRefreshValidator";
import {bakeCookies} from "../../helpers/cookies/bakeCookies";



export const getTokenFromRefreshToken = async (req: Request, res: Response) => {

    // we validate the refresh token and return a new access token and refresh token
    const refreshToken = req.refreshToken;
    let refreshTokenValidator = await generateTokensFromRefreshToken(refreshToken) as IRefreshValidator;
    if (refreshTokenValidator.valid) {
        //create a grand token object to be sent for creating cookies
        let grandToken: IGrandToken = {
            accessToken: refreshTokenValidator.accessToken,
            refreshToken: refreshTokenValidator.refreshToken,
            user: refreshTokenValidator.user,
            accessTokenExpiration: refreshTokenValidator.accessTokenExpiration.toLocaleString(),
            refreshTokenExpiration: refreshTokenValidator.refreshTokenExpiration.toLocaleString()
        };
        // set cookies
        await bakeCookies(res, grandToken);

        res.status(HttpStatusCodes.OK).json({
            grandToken
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
        // set cookies
        await bakeCookies(res, grandToken);
      res.status(HttpStatusCodes.OK).json(grandToken);

  } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server error");
  }

};