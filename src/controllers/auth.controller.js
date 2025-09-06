import { NODE_ENV } from "../common/constants/app.constant";
import { responseSuccess } from "../common/helpers/response.helper";
import { authService } from "../services/auth.service";

const sendTokens = (res, resData, tokens) => {
  const cookieOption = { httpOnly: true };
  if (NODE_ENV === "production") cookieOption.secure = true;
  const tokenString = JSON.stringify(tokens);
  res.cookie("authTokens", tokenString, cookieOption);
  res.status(resData.statusCode).json(resData);
};

export const authController = {
  register: async function (req, res, next) {
    const result = await authService.register(req);
    const response = responseSuccess(result, `Create auth successfully`);
    res.status(response.statusCode).json(response);
  },

  login: async function (req, res, next) {
    const result = await authService.login(req);
    const response = responseSuccess(true, `Get tokens successfully`);
    sendTokens(res, response, result);
  },

  refeshToken: async function (req, res, next) {
    const result = await authService.refeshToken(req);
    const response = responseSuccess(true, `Refesh tokens successfully`);
    sendTokens(res, response, result);
  },
};
