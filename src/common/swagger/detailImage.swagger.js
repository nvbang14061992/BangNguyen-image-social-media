export const detailImageSwagger = {
  "/detail-image/image/": {
    get: {
      tags: ["Detail Image"],
      summary: "get image and posted user",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "query",
          type: "number",
        },
      ],
      responses: {
        200: {
          description: "Get image and posted user successfully",
        },
      },
    },
  },
  "/detail-image/save/": {
    get: {
      tags: ["Detail Image"],
      summary: "get save info",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "query",
          type: "number",
        },
      ],
      responses: {
        200: {
          description: "Get save successfully",
        },
      },
    },
  },
  "/detail-image/comments/": {
    get: {
      tags: ["Detail Image"],
      summary: "get all comments for image",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "query",
          type: "number",
        },
      ],
      responses: {
        200: {
          description: "Get all comments to image successfully",
        },
      },
    },
  },
  "/detail-image/comment/": {
    post: {
      tags: ["Detail Image"],
      summary: "add comment for image",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "query",
          type: "number",
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                content: {
                  type: "string",
                  example: "This new comment from new user",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Add comment to image successfully",
        },
      },
    },
  },
};
