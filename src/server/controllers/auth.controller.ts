import { OptionsType } from "cookies-next/lib/types";
import { ISignup, ILogin } from "../../schemas/auth";
import bcrypt from "bcryptjs";
import {
  createUser,
  findUniqueUser,
  findUser,
  signToken,
} from "../services/user.service";
import { TRPCError } from "@trpc/server";
import { Context } from "../api/trpc";
import { getCookie, setCookie, getCookies } from "cookies-next";
import { SignJWT } from "jose";
import { nanoid } from "nanoid";
import cookie from "cookie";

const cookieOptions: OptionsType = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};
const accessTokenCookieOptions: OptionsType = {
  ...cookieOptions,
  expires: new Date(Date.now() + process.env.ACCESS_TOKEN_EXP * 1),
};

export const registerHandler = async ({ input }: { input: ISignup }) => {
  try {
    console.log("INPUT");
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await createUser({
      email: input.email,
      username: input.username,
      password: hashedPassword,
    });
    return {
      status: "success",
      data: {
        user,
      },
    };
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Email already registered",
      });
    }
    throw error;
  }
};
export const loginHandler = async ({
  input,
  ctx: { req, res },
}: {
  input: ILogin;
  ctx: Context;
}) => {
  try {
    const user = await findUser({ email: input.email });
    if (!user || !(await bcrypt.compare(input.password, user.password))) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid email or password",
      });
    }
    const { access_token } = await signToken(user);

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("access_token", access_token, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: Number(process.env.ACCESS_TOKEN_EXP ),
      })
    );
    const { username, id } = user;
    return {
      status: "success",
      body: {
        username,
        id,
      },
    };
  } catch (error) {
    throw error;
  }
};

// export const refreshAccessTokenHandler = async ({
//   ctx: { req, res },
// }: {
//   ctx: Context;
// }) => {
//   try {
//     const refresh_token = getCookie("refresh_token", { req, res }) as string;
//     const message = "Could not refresh token";
//     if (!refresh_token) {
//       throw new TRPCError({
//         code: "FORBIDDEN",
//         message,
//       });
//     }
//
//     const decoded = verifyJwt<{ sub: string }>(
//       refresh_token,
//       process.env.REFRESH_TOKEN
//     );
//     if (!decoded) {
//       throw new TRPCError({
//         code: "FORBIDDEN",
//         message,
//       });
//     }
//     const session = await redisClient.get(decoded.sub);
//     if (!session) {
//       throw new TRPCError({
//         code: "FORBIDDEN",
//         message,
//       });
//     }
//     console.log("@@@@@", decoded.sub, session);
//     const user = await findUniqueUser({
//       id: JSON.parse(session).id as string,
//     });
//
//     if (!user) {
//       throw new TRPCError({
//         code: "FORBIDDEN",
//         message,
//       });
//     }
//     //sign new token
//     const access_token = signJwt({ sub: user.id }, process.env.ACCESS_TOKEN, {
//       expiresIn: `${process.env.ACCESS_TOKEN_EXP}s`,
//     });
//
//     setCookie("access_token", access_token, {
//       req,
//       res,
//       ...accessTokenCookieOptions,
//     });
//     setCookie("logged_in", "true", {
//       req,
//       res,
//       ...accessTokenCookieOptions,
//       httpOnly: false,
//     });
//
//     return {
//       status: "succes",
//       access_token,
//     };
//   } catch (error) {
//     throw error;
//   }
// };

const logout = ({ ctx: { req, res } }: { ctx: Context }) => {
  setCookie("access_token", "", { req, res, maxAge: -1 });
  setCookie("refresh_token", "", { req, res, maxAge: -1 });
  setCookie("logged_in", "", { req, res, maxAge: -1 });
};

export const logoutHandler = async ({ ctx }: { ctx: Context }) => {
  try {
    const user = ctx.user;
    console.log("USER", user);
    // await redisClient.del(String(user?.id));
    logout({ ctx });
    return { status: "succes" };
  } catch (error) {
    throw error;
  }
};

export const verifyJwtHandler = async (token: string) => {
  try {
    const decoded = verifyJwt(token, process.env.ACCESS_TOKEN);
    return decoded;
  } catch (error) {
    throw error;
  }
};
