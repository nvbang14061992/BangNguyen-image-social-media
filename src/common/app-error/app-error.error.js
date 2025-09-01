import jwt from "jsonwebtoken";
import { responseError } from "../helpers/response.helper";
import { statusCodes } from "../helpers/status-code.helper";

export const appError = (err, req, res, next) => {
    console.log("-->>>>>>>>>>>> Special Middleware");

    // 401 => logout
    // 403 => refresh token
    if (err instanceof jwt.JsonWebTokenError) err.code = statusCodes.UNAUTHORIZED;
    if (err instanceof jwt.TokenExpiredError) err.code = statusCodes.FORBIDDEN;
    const resData = responseError(err?.message, err?.code, err?.stack);
    res.status(resData.statusCode).json(resData);
    console.log(err);
};