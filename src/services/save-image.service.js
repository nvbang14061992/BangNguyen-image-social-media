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
    };