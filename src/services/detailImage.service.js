import { BadRequestException } from "../common/helpers/exception.helper";
import prisma from "../common/prisma/init.prisma";

export const detailImageService = {
   comments: async function (req) {
      const imageId = req.query.id;
      if (!imageId) throw new BadRequestException("Missing image id!!!");
      const comments = await prisma.comments.findMany({
         where: {
            imageId: +imageId
         }
      });

      return comments;
   },

   addComment: async function (req) {
      const imageId = req.query.id;
      const userId = req.user.id;
      const content = req.body.content;
      if (!imageId) throw new BadRequestException("Missing image id!!!");
      if (!content) throw new BadRequestException("Missing content!!!");
      await prisma.comments.create({
         data: {
            imageId: +imageId,
            userId: +userId,
            content: content
         }
      });

      const comments = await prisma.comments.findMany({
         where: {
            imageId: +imageId
         }
      });
      
      return comments;
   },

   save: async function (req) {
      const imageId = req.query.id;
      const userId = req.user.id;
      if (!imageId) throw new BadRequestException("Missing image id!!!");

      const savedImages = await prisma.saved_images.findFirst({
            where: {
               imageId: +imageId,
               userId: +userId
            }
      });

      return savedImages ? true : false; //return boolean
   },

   image: async function (req) {
      const imageId = req.query.id;
      if (!imageId) throw new BadRequestException("Missing image id!!!");
      
      const imageExist = await prisma.images.findUnique({
            where: {
                id: +imageId
            }
      })

      if (!imageExist) throw new BadRequestException("Image not exist!!!")

      imageExist.pathToImage = `images/${imageExist.pathToImage}`;

      return imageExist; //return image url, user posted
   },

};