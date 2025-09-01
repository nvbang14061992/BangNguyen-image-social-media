import { responseSuccess } from "../common/helpers/response.helper";
import { authService } from "../services/auth.service";

export const authController = {
   register: async function (req, res, next) {
      const result = await authService.register(req);
      const response = responseSuccess(result, `Create auth successfully`);
      res.status(response.statusCode).json(response);
   },

   login: async function (req, res, next) {
      const result = await authService.login(req);
      const response = responseSuccess(result, `Get all auths successfully`);
      res.status(response.statusCode).json(response);
   },

   refeshToken: async function (req, res, next) {
      const result = await authService.refeshToken(req);
      const response = responseSuccess(result, `Get auth #${req.params.id} successfully`);
      res.status(response.statusCode).json(response);
   },

};