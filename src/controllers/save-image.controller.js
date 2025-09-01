import { responseSuccess } from "../common/helpers/response.helper";
import { saveImageService } from "../services/save-image.service";

export const saveImageController = {
   create: async function (req, res, next) {
      const result = await saveImageService.create(req);
      const response = responseSuccess(result, `Create saveImage successfully`);
      res.status(response.statusCode).json(response);
   },

   findAll: async function (req, res, next) {
      const result = await saveImageService.findAll(req);
      const response = responseSuccess(result, `Get all saveImages successfully`);
      res.status(response.statusCode).json(response);
   },

   findOne: async function (req, res, next) {
      const result = await saveImageService.findOne(req);
      const response = responseSuccess(result, `Get saveImage #${req.params.id} successfully`);
      res.status(response.statusCode).json(response);
   },

   update: async function (req, res, next) {
      const result = await saveImageService.update(req);
      const response = responseSuccess(result, `Update saveImage #${req.params.id} successfully`);
      res.status(response.statusCode).json(response);
   },

   remove: async function (req, res, next) {
      const result = await saveImageService.remove(req);
      const response = responseSuccess(result, `Remove saveImage #${req.params.id} successfully`);
      res.status(response.statusCode).json(response);
   }
};