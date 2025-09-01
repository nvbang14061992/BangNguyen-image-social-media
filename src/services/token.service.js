import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRED_IN, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRED_IN } from '../common/constants/app.constant';

export const tokenService = {
    createTokens: (userId) => {
        const accessToken = jwt.sign( 
            {userId: userId},
            ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRED_IN }
        );

        const refeshToken = jwt.sign( 
            {userId: userId},
            REFRESH_TOKEN_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRED_IN }
        );
        
        return {
            accessToken: accessToken,
            refreshToken: refeshToken
        };
    },

    verifyAccessToken: (accessToken, option) => {
        const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET, option);
        return decoded;
   },

   verifyRefreshToken: (refeshToken) => {
        const decoded = jwt.verify(refeshToken, REFRESH_TOKEN_SECRET);
        return decoded;
   },
}