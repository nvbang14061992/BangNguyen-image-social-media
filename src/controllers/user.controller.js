import { responseSuccess } from "../common/helpers/response.helper";
import { userService } from "../services/user.service";


export const userController = {
   update: async function (req, res, next) {
      const result = await userService.update(req);
      const response = responseSuccess(result, `Updated user profile!!!`);
      res.status(response.statusCode).json(response);
   },

   getInfo: async function (req, res, next) {
      const result = await userService.getInfo(req);
      const response = responseSuccess(result, `Get user info successfully`);
      res.status(response.statusCode).json(response);
   },
   
   uploadAvatarLocal: async function (req, res, next) {
      const result = await userService.uploadAvatarLocal(req);
      const response = responseSuccess(result, `Get user info successfully`);
      res.status(response.statusCode).json(response);
   },

   findImages: async function (req, res, next) {
      const result = await userService.findImages(req);
      const response = responseSuccess(result, `Get all posted images successfully`);
      res.status(response.statusCode).json(response);
   },

   findSavedImages: async function (req, res, next) {
      const result = await userService.findSavedImages(req);
      const response = responseSuccess(result, `Get all saved images successfully`);
      res.status(response.statusCode).json(response);
   },

   removeImage: async function (req, res, next) {
      const result = await userService.removeImage(req);
      const response = responseSuccess(result, `Remove image successfully`);
      res.status(response.statusCode).json(response);
   },
};