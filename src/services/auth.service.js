import bcrypt from "bcrypt";
import prisma from "../common/prisma/init.prisma";
import { BadRequestException } from "../common/helpers/exception.helper";

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
      return `This action returns all auth`;
   },

   refeshToken: async function (req) {
      return `This action returns a id: ${req.params.id} auth`;
   },
};