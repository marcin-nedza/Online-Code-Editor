import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export const findUniqueUser = async (
  where: Prisma.UserWhereUniqueInput,
  select?: Prisma.ProjectSelect
) => {
  return await prisma.user.findUnique({
    where,
    select,
  });
};
