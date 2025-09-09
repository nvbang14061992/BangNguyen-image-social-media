export const imageSwagger = {
  "/image/": {
    get: {
      tags: ["Image"],
      summary: "Get all images",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "page",
          in: "query",
          type: "number",
        },
        {
          name: "pageSize",
          in: "query",
          type: "number",
        },
        {
          name: "filter",
          in: "query",
          type: "string",
        },
      ],
      responses: {
        200: {
          description: "Get all images successfully!",
        },
      },
    },
    post: {
      tags: ["Image"],
      summary: "Upload an image",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["image", "name"],
              properties: {
                image: {
                  type: "string",
                  format: "binary",
                },
                name: {
                  type: "string",
                  example: "This is new image",
                },
                description: {
                  type: "string",
                  example: "This is new image description",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Create image successfully!",
        },
      },
    },
  },

  "/image/{id}": {
    get: {
      tags: ["Image"],
      summary: "Get detailed image",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "id image",
          required: true,
        },
      ],
      responses: {
        200: {
          description: "Get image # successfully!",
        },
      },
    },
  },
};
