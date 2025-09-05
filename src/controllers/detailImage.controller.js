import { responseSuccess } from "../common/helpers/response.helper";
import { detailImageService } from "../services/detailImage.service";

export const detailImageController = {
   comments: async function (req, res, next) {
      const result = await detailImageService.comments(req);
      const response = responseSuccess(result, `Get all comments to image successfully`);
      res.status(response.statusCode).json(response);
   },

   addComment: async function (req, res, next) {
      const result = await detailImageService.addComment(req);
      const response = responseSuccess(result, `Get all comments to image successfully`);
      res.status(response.statusCode).json(response);
   },

   save: async function (req, res, next) {
      const result = await detailImageService.save(req);
      const response = responseSuccess(result, `Get save successfully`);
      res.status(response.statusCode).json(response);
   },

   image: async function (req, res, next) {
      const result = await detailImageService.image(req);
      const response = responseSuccess(result, `Get image and posted user successfully`);
      res.status(response.statusCode).json(response);
   },
};