export const authSwagger = {
  "/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "register system",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  example: "TestUser1@example.com",
                },
                password: {
                  type: "string",
                  example: "passABC123#@",
                },
                full_name: {
                  type: "string",
                  example: "TestUser1",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Register successfully!",
        },
      },
    },
  },
  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "login system",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  example: "bangg@gmail.com",
                },
                password: {
                  type: "string",
                  example: "12345",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Login successfully!",
        },
      },
    },
  },
  "/auth/refesh-token": {
    post: {
      tags: ["Auth"],
      summary: "login system",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                accessToken: {
                  type: "string",
                  example: "abcXYZ12345token",
                },
                refreshToken: {
                  type: "string",
                  example: "abcXYZ12345token",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Refesh tokens successfully!",
        },
      },
    },
  },
};
