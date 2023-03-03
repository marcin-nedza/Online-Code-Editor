import { Prisma } from "@prisma/client";
import {TCreateFile} from "../../schemas/file";
import { prisma } from "../db";

export const createFile=(data:TCreateFile)=>{
   return prisma.file.create({data}) 
}
