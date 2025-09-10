export const userSwagger = {
  "/user/": {
    get: {
      tags: ["User"],
      summary: "get user info",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Get user info successfully",
        },
      },
    },
  },
  "/user/uploads/": {
    get: {
      tags: ["User"],
      summary: "get user posted images",
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
          description: "Get all posted images successfully",
        },
      },
    },
  },
  "/user/saves/": {
    get: {
      tags: ["User"],
      summary: "get user saved images",
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
          description: "Get all saved images successfully",
        },
      },
    },
  },
  "/user/profile/": {
    patch: {
      tags: ["User"],
      summary: "update user profile",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                fullName: {
                  type: "string",
                  example: "New Name",
                },
                age: {
                  type: "number",
                  example: "18",
                },
                description: {
                  type: "string",
                  example: "New description",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Updated user profile successfully",
        },
      },
    },
  },
  "/user/avatar-local/": {
    post: {
      tags: ["User"],
      summary: "update user avatar",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["image"],
              properties: {
                image: {
                  type: "string",
                  format: "binary",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Updated user profile successfully",
        },
      },
    },
  },
  "/user/delete-image/:id": {
    delete: {
      tags: ["User"],
      summary: "delete an posted image",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "image id",
          required: true,
        },
      ],
      responses: {
        200: {
          description: "Updated avatar successfully",
        },
      },
    },
  },
};
