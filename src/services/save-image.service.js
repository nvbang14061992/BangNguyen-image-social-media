import { BadRequestException } from "../common/helpers/exception.helper";
import prisma from "../common/prisma/init.prisma";

export const saveImageService = {
    create: async function (req) {
        return `This action create`;
    },

    findAll: async function (req) {
        return `This action returns all saveImage`;
    },

    findOne: async function (req) {
        return `This action returns a id: ${req.params.id} saveImage`;
    },

    update: async function (req) {
        return `This action updates a id: ${req.params.id} saveImage`;
    },

    remove: async function (req) {
        return `This action removes a id: ${req.params.id} saveImage`;
    },

    toggleSave: async function (req) {
        const {imageId} = req.body;
        if (!imageId) throw new BadRequestException("Missing image id")
        const user = req.user;

        const saveExist = await prisma.saved_images.findFirst({
            where: {
                userId: user.id,
                imageId: imageId
            }
        });
        console.log(saveExist)
        // remove save if image was saved
        if (saveExist) {
            await prisma.saved_images.delete({
                where: {
                    userId_imageId: {
                        userId: saveExist.userId,
                        imageId: saveExist.imageId,
                    },
                }
            })

            return {message: "save removed"};
        } else {
            const newSave = await prisma.saved_images.create({
                data: {
                    imageId: imageId,
                    userId: user.id
                }
            });

            return {message: `Image saved ${newSave}`}
        }

    },
};