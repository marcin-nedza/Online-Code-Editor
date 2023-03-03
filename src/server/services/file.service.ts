import { TRPCError } from "@trpc/server";
import {TCreateFile} from "../../schemas/file";
import {createFile} from "../repository/file.repository";
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
