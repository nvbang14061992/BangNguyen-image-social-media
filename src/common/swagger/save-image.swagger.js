export const saveImageSwagger = {
  "/save-image/toggle-save/": {
    post: {
      tags: ["Save-Image"],
      summary: "Save an image",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                imageId: {
                  type: "number",
                  example: "1",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Toggle saveImage successfully",
        },
      },
    },
  },
};
