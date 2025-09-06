import bcrypt from "bcrypt";
import prisma from "../common/prisma/init.prisma";
import { BadRequestException } from "../common/helpers/exception.helper";
import { tokenService } from "./token.service";

export const authService = {
    register: async function (req) {
        const { email, password, fullName } = req.body;

        const userExist = await prisma.users.findUnique({
            where: {
                email: email
            }
        })

        if (userExist) {
            throw new BadRequestException(`Email ${email} already exists`);
        }

        // Hash the password before saving
        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = await prisma.users.create({
            data: {
                email: email,
                password: hashedPassword,
                fullName: fullName
            }
        })

        return true;
   },

   login: async function (req) {
        const { email, password } = req.body;

        const userExist = await prisma.users.findUnique({
            where: {
            email: email
            }
        });

        if (!userExist) throw new BadRequestException(`Email ${email} not found, please register first`);

        // Check if the password matches
        const isPasswordValid = bcrypt.compareSync(password, userExist.password);
        if (!isPasswordValid) throw new BadRequestException(`Invalid password`);

        // return tokens
        const tokens = tokenService.createTokens(userExist.id);

        return tokens;
    },

   refeshToken: async function (req) {
        const { accessToken, refreshToken } = req.body;
        // can not use verifying access token here because it was expired
        const decodeAccessToken =  tokenService.verifyAccessToken(accessToken, { ignoreExpiration: true }); 
        const decodeRefeshToken =  tokenService.verifyRefreshToken(refreshToken); 

        if (decodeAccessToken.userId !== decodeRefeshToken.userId) throw new UnauthrozedException(`Invalid tokens`);

        const user = await prisma.users.findUnique({
            where: {
            id: Number(decodeAccessToken.userId)
            }
        })

        if (!user) throw new UnauthrozedException(`User not found`);

        const tokens = tokenService.createTokens(user.id);
        return tokens;
    }
};