import {jwtVerify,SignJWT,decodeJwt} from "jose"

interface UserJwtPayload{
    jti:string;
    iat:number
}

export const verifyAuth =async(token:string) =>{
    try {
        const verified = await jwtVerify(token,new TextEncoder().encode(process.env.ACCESS_TOKEN) ) 
        return verified.payload as UserJwtPayload
        
    } catch (error) {
        
        throw new Error('Your token has expired')
    }
    
}
