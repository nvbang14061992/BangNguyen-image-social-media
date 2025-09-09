import { authSwagger } from "./auth.swagger";
import { detailImageSwagger } from "./detailImage.swagger";
import { imageSwagger } from "./image.swagger";
import { saveImageSwagger } from "./save-image.swagger";
import { userSwagger } from "./user.swagger";
// import { userSwagger } from "./user.swagger";

export const swaggerDocument = {
  openapi: "3.1.1",
  info: {
    title: "Image Social Media",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Sever BE local",
    },
    {
      url: "http://domain.com/api",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    ...authSwagger,
    ...imageSwagger,
    ...saveImageSwagger,
    ...detailImageSwagger,
    ...userSwagger,
  },
};
