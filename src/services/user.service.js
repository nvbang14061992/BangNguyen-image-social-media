import { BadRequestException } from "../common/helpers/exception.helper";
import prisma from "../common/prisma/init.prisma";
import fs from "fs";
import path from "path";

export const userService = {
  update: async function (req) {
    const updateData = req.body;
    const userId = req.user.id;
    if (Object.keys(updateData).length === 0) {
      return null;
    }

    // return error if email, password, avatar_path, deletedBy, isdeleted, deletedAt, createdAt and updatedAt are being updated
    if (
      updateData.email ||
      updateData.password ||
      updateData.avatar_path ||
      updateData.deletedBy ||
      updateData.isDeleted ||
      updateData.deletedAt ||
      updateData.createdAt ||
      updateData.updatedAt
    ) {
      throw new BadRequestException("Permission denied!");
    }

    const newInfo = await prisma.users.update({
      where: { id: userId },
      data: updateData,
    });
    delete newInfo.password;
    return newInfo;
  },

  uploadAvatarLocal: async function (req) {
    if (!req.file) {
      throw new BadRequestException("Upload file not found!");
    }

    const user = req.user;
    const avatarPath = "avatars/" + req.file.filename;

    const newInfo = await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        avatar_path: avatarPath,
      },
    });

    console.log(newInfo);
    if (user.avatar_path) {
      // xóa avatar đã tồn tại
      console.log(user.avatar_path);
      const oldFilePath = path.join("public/avatars", user.avatar_path);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    delete newInfo.password;
    return newInfo;
  },

  removeImage: async function (req) {
    const imageId = req.params.id;
    if (!imageId) throw new BadRequestException("Image ID is required");
    if (+imageId <= 0)
      throw new BadRequestException("Image ID must be a positive number");
    // if imageId is not a number
    if (isNaN(+imageId))
      throw new BadRequestException("Image ID must be a number");
    // Check if image exists
    const imageExiting = await prisma.images.findUnique({
      where: { id: +imageId },
    });
    if (!imageExiting) throw new BadRequestException("Image not found");

    // Check if the image belongs to the user
    if (imageExiting.userId !== req.user.id)
      throw new BadRequestException(
        "You do not have permission to delete this image"
      );
    // Delete the image
    const filePath = path.join("public/images", imageExiting.pathToImage);
    // delete all saved, comment of this imageId
    await prisma.$transaction([
      prisma.saved_images.deleteMany({
        where: { imageId: imageExiting.id },
      }),
      prisma.comments.deleteMany({
        where: { imageId: imageExiting.id },
      }),
      prisma.images.delete({
        where: { id: imageExiting.id },
      }),
    ]);

    const recheckImage = await prisma.images.findUnique({
      where: { id: +imageId },
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
      where: { id: userId },
    });
    const resData = {
      userName: user.fullName,
      email: user.email,
      avatar: user.avatar,
    };
    return resData;
  },

  findImages: async function (req) {
    const userId = req.user.id;
    let { page, pageSize, filters } = req.query;
    page = +page > 0 ? +page : 1; // avoid return error, for user experience
    pageSize = +pageSize > 0 ? +pageSize : 10;
    filters = JSON.parse(filters || "{}") || {};

    const index = (page - 1) * +pageSize; // default pageSize is 3

    // process filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        delete filters[key];
        return;
      }

      if (typeof value === "string") {
        filters[key] = {
          contains: value,
        };
      }
    });

    const imagesPromise = prisma.images.findMany({
      skip: index,
      take: +pageSize,

      where: {
        userId: userId,
        ...filters,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // counts total rows in table
    const totalItemsPromise = prisma.images.count();

    const [images, totalItems] = await Promise.all([
      imagesPromise,
      totalItemsPromise,
    ]);

    // calculate total pages
    const totalPages = Math.ceil(totalItems / +pageSize);
    return {
      page,
      pageSize,
      totalItem: totalItems,
      totalPage: totalPages,
      items: images || [],
    };
  },

  findSavedImages: async function (req) {
    const userId = req.user.id;
    let { page, pageSize, filters } = req.query;
    page = +page > 0 ? +page : 1; // avoid return error, for user experience
    pageSize = +pageSize > 0 ? +pageSize : 10;
    filters = JSON.parse(filters || "{}") || {};

    const index = (page - 1) * +pageSize; // default pageSize is 3

    // process filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        delete filters[key];
        return;
      }

      if (typeof value === "string") {
        filters[key] = {
          contains: value,
        };
      }
    });

    const savedImagesPromise = prisma.saved_images.findMany({
      skip: index,
      take: +pageSize,
      where: { userId: userId },
      // include: {
      //   Images: true,
      // },
      orderBy: {
        createdAt: "desc", // optional: most recently saved first
      },
    });

    // counts total rows in table
    const totalItemsPromise = prisma.saved_images.count({
      where: { userId: userId },
    });

    const [savedImages, totalItems] = await Promise.all([
      savedImagesPromise,
      totalItemsPromise,
    ]);

    const images = await prisma.images.findMany({
      where: {
        id: { in: savedImages.map((entry) => entry.imageId) },
        ...filters,
      },
    });

    console.log(images);
    const imagesOnly = images.map((entry) => {
      const { id, name, pathToImage, description, userId } = entry;
      return {
        id,
        name,
        pathToImage: `images/${pathToImage}`,
        description,
        postedUserId: userId,
      };
    });

    // calculate total pages
    const totalPages = Math.ceil(totalItems / +pageSize);
    return {
      page,
      pageSize,
      totalItem: totalItems,
      totalPage: totalPages,
      items: imagesOnly || [],
    };
  },
};
