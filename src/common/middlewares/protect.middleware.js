import { tokenService } from "../../services/token.service";
import { UnauthrozedException } from "../helpers/exception.helper";
import prisma from "../prisma/init.prisma";



export const protect = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) throw new UnauthrozedException(`Unauthorized`);

    const [type, accessToken] = authorization && authorization.split(' ');
    if (type !== 'Bearer') throw new UnauthrozedException(`Type is not Bearer`);
    // decode the token
    if (!accessToken)throw new UnauthrozedException(`Invalid access token`);
    

    const {userId} = tokenService.verifyAccessToken(accessToken);

    const user = await prisma.users.findUnique({
        where: {
            id: Number(userId)
        }
    })
    
    if (!user) throw new UnauthrozedException(`User not found`);

    req.user = user;
    
    next();
};