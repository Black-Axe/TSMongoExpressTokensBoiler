import {Response} from "express";
import { generatePayload } from "../../utils/generatePayload";
import Request from "../../types/Request";
import { generateAccessToken, generateRefreshToken } from "../../helpers/generateToken";
import { IRefreshToken } from "../../models/RefreshToken/RefreshToken";
import HttpStatusCodes from "http-status-codes";

export const getTokenFromRefreshToken = async (req: Request, res: Response) => {
    console.log(req.cookies)
  /*
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    */
    const { refreshToken } = req.body;
    console.log(refreshToken)
    res.send("ok")
};

export const getTokenFromEmailPass = async (req: Request, res: Response) => {
  try {
      const user = req.user;
      const payload = generatePayload(user);
      let accessToken = generateAccessToken(payload);
      let refreshToken = await generateRefreshToken(user) as IRefreshToken;
      console.log(refreshToken)
      console.log(accessToken)
      res.status(HttpStatusCodes.OK).json({
          accessToken: accessToken,
          accessTokenExpiration: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toLocaleString(),
          refreshToken: refreshToken.token,
          refreshTokenExpiration: refreshToken.expiryDate.toLocaleString(),
      });
  } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server error");
  }
};