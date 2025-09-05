import { BadRequestException } from "../common/helpers/exception.helper";
import prisma from "../common/prisma/init.prisma";
import fs from 'fs';
import path from "path";

export const userService = {
   update: async function (req) {
      const updateData = req.body;
      const userId = req.user.id;
      const newInfo = await prisma.users.update({
         where: { id: userId },
         data: updateData
      });
      delete  newInfo.password;
      return newInfo;
   },

   uploadAvatarLocal: async function (req) {
        if(!req.file) {
            throw new BadRequestException("Upload file not found!")
        }

        const user = req.user;
        console.log(user)

        const newInfo = await prisma.users.update({
            where: {
                id: user.id
            },
            data: {
                avatar_path: req.file.filename
            }
        });

        console.log(newInfo)
        if (user.avatar_path) {
            // xóa avatar đã tồn tại
            console.log(user.avatar_path)
            const oldFilePath = path.join("public/avatars", user.avatar_path);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath)
            }
        }

        delete  newInfo.password;
        return newInfo;
   },

   removeImage: async function (req) {
      const imageId = req.params.id;
      if (!imageId) throw new BadRequestException('Image ID is required');
      if (+imageId <= 0) throw new BadRequestException('Image ID must be a positive number');
      // if imageId is not a number
      if (isNaN(+imageId)) throw new BadRequestException('Image ID must be a number');
      // Check if image exists
      const imageExiting = await prisma.images.findUnique({
         where: { id: +imageId }
      });
      if (!imageExiting) throw new BadRequestException('Image not found');
      
      // Check if the image belongs to the user
      if (imageExiting.userId !== req.user.id) throw new BadRequestException('You do not have permission to delete this image');
      // Delete the image
      const filePath = path.join("public/images", imageExiting.pathToImage);
      // delete all saved, comment of this imageId
      await prisma.$transaction([
         prisma.saved_images.deleteMany({
            where: { imageId: imageExiting.id }
         }),
         prisma.comments.deleteMany({
            where: { imageId: imageExiting.id }
         }),
         prisma.images.delete({
            where: {id: imageExiting.id}
         })
      ]);

      const recheckImage = await prisma.images.findUnique({
         where: { id: +imageId }
      });
      // delete file in folder when result not empty
      if (!recheckImage) {
         console.log(recheckImage);
         if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
         }
      }

      return true;
   },

   getInfo: async function (req) {
      const userId = req.user.id;
      const user = await prisma.users.findUnique({
         where: { id: userId }
      });
      const resData = {userName: user.fullName, email: user.email, avatar: user.avatar};
      return resData;
   },

   findImages: async function (req) {
      const userId = req.user.id;
      const images = await prisma.images.findMany({
         where: { userId: userId }
      });
      
      return images;
   },

   findSavedImages: async function (req) {
      const userId = req.user.id;
      const savedImages = await prisma.saved_images.findMany({
         where: { userId: userId },
         include: { 
            Images: true
         },
         orderBy: {
            createdAt: 'desc', // optional: most recently saved first
         }
      });

      const imagesOnly = savedImages.map(entry => {
         return {
            id: entry.Images.id,
            name: entry.Images.name,
            pathToImage: `images/${entry.Images.pathToImage}`,
            postedUserId: entry.Images.userId,
         }
      });
      return imagesOnly;
   },
};