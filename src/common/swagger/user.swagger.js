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
};
