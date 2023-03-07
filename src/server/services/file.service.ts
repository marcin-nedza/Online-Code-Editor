import { TRPCError } from "@trpc/server";
import {TCreateFile, TGetOneFile, TUpdateFile} from "../../schemas/file";
import {createFile, deleteFile, findUniqueFile, updateFile} from "../repository/file.repository";
import {findUniqueProject} from "../repository/project.repository";

export const createFileService = async (input: TCreateFile) => {
const project = await findUniqueProject({id:input.projectId});
  if (!project) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Project not found",
    });
  }

  return await createFile(input);
};
export const findUniqueFileService=async({fileId}:{fileId:string}) =>{
    return await findUniqueFile({id:fileId})
}
export const saveFile = async ({ content, id }: TUpdateFile) => {
  return await updateFile({ id }, content);
};
export const deleteFileService=async({id}:TGetOneFile)=>{
    return await deleteFile({id})
}
