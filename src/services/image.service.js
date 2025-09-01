import prisma from "../common/prisma/init.prisma";
import { BadRequestException } from "../common/helpers/exception.helper";

export const imageService = {
    create: async function (req) {
        const {name, description} = req.body;
        if(!req.file) throw new BadRequestException("Upload file not found!");
        
        if(!name) throw new BadRequestException("Missing title for image");

        const user = req.user;

        await prisma.images.create({
            data: {
                pathToImage: req.file.filename,
                name: name,
                description: description,
                userId: user.id
            }
        });

        return true;
    },

    findAll: async function (req) {
        let { page, pageSize, filters} = req.query;
        page = +page > 0 ? +page : 1; // avoid return error, for user experience
        pageSize = +pageSize > 0 ? +pageSize : 10;
        filters = JSON.parse(filters || "{}") || {};

        const index = (page - 1) * (+pageSize); // default pageSize is 3
        
        // process filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') {
                delete filters[key];
                return;
            }

            if (typeof value === 'string') {
                filters[key] = {
                contains: value,
            };
            }
        });

        const imagesPromise =  prisma.images.findMany({
            skip: index,
            take: +pageSize,

            where: filters,
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        // counts total rows in table
        const totalItemsPromise =  prisma.images.count();

        const [images, totalItems] = await Promise.all([imagesPromise, totalItemsPromise])
            

        // calculate total pages
        const totalPages = Math.ceil(totalItems / +pageSize);
        return {
            page,
            pageSize,
            totalItem: totalItems, 
            totalPage: totalPages, 
            items: images || []
        };
    },

   findOne: async function (req) {
      return `This action returns a id: ${req.params.id} image`;
   },

   update: async function (req) {
      return `This action updates a id: ${req.params.id} image`;
   },

   remove: async function (req) {
      return `This action removes a id: ${req.params.id} image`;
   },
};