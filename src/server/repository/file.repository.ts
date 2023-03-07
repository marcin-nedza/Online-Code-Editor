import { Prisma } from "@prisma/client";
import { TCreateFile } from "../../schemas/file";
import { prisma } from "../db";

export const createFile = (data: TCreateFile) => {
  return prisma.file.create({ data });
};

export const findUniqueFile = async (where: Prisma.FileWhereUniqueInput) => {
  return await prisma.file.findUnique({
    where,
  });
};
export const updateFile = async (
  where: Prisma.FileWhereUniqueInput,
  content: string
) => {
  return await prisma.file.update({
    data: { content },
    where,
  });
};

export const deleteFile = async (where: Prisma.FileWhereUniqueInput)=>{
    return await prisma.file.delete({where})
}
