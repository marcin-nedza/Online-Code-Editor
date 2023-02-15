import { Prisma, User } from "@prisma/client";
import {SignJWT} from "jose";
import {nanoid} from "nanoid";
import { ISignup } from "../../schemas/auth";
import { prisma } from "../db";
import redisClient from "../utils/connectRedis";

export const createUser = async (input: ISignup) => {
  return await prisma.user.create({
    data: input,
  });
};

export const findUser = async (
  where: Partial<Prisma.UserWhereInput>,
  select?: Prisma.UserSelect
) => {
  return (await prisma.user.findFirst({
    where,
    select,
  })) as User;
};

export const findUniqueUser = async (
  where: Prisma.UserWhereUniqueInput,
  select?: Prisma.UserSelect
) => {
  return (await prisma.user.findUnique({
    where,
    select,
  })) as User;
};

export const updateUser = async (
  where: Partial<Prisma.UserWhereUniqueInput>,
  select: Prisma.UserSelect,
  data: Prisma.UserUpdateInput
) => {
  return (await prisma.user.update({
    where,
    data,
    select,
  })) as User;
};

export const signToken = async (user: User) => {
await redisClient.set(`${user.id}`,JSON.stringify(user),{
        EX:Number(process.env.REDIS_CACHE_EXP)  
    })
   // const access_token = signJwt({ sub: user }, process.env.ACCESS_TOKEN, {
   //   expiresIn: `${process.env.ACCESS_TOKEN_EXP}s`,
   // });
  
const access_token = await new SignJWT({sub:user})
      .setProtectedHeader({ alg: "HS256" })
      .setJti(nanoid())
      .setIssuedAt()
      .setExpirationTime("10m")
      .sign(new TextEncoder().encode(process.env.ACCESS_TOKEN));

  // const refresh_token = signJwt({ sub: user }, process.env.REFRESH_TOKEN, {
  //   expiresIn: `${process.env.REFRESH_TOKEN_EXP}s`,
  // });
    const refresh_token='aaa'
  return { access_token, refresh_token };
};
export const setSession = async (userId: string) => {
    console.log('USERID',userId)
  return await prisma.session.create({
        data:{
            userId
        }
    })
};
export const findSession=async(userId:string)=>{
    return await prisma.session.findUnique({
        where:{
            userId
        }
    })
}
