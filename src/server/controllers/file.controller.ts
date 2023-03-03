import { TRPCError } from "@trpc/server";
import { TCreateFile } from "../../schemas/file";
import { createFileService } from "../services/file.service";
import { findUniqueProjectService } from "../services/project.service";

export const createFileHandler = async ({ input }: { input: TCreateFile }) => {
  try {
    const project = await findUniqueProjectService(input.projectId);
    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Could not find project",
      });
    }
    const file = await createFileService(input);
    return {
      status: "success",
      data: file,
    };
  } catch (error: any) {
    if (error instanceof TRPCError) {
      throw error;
    } else {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create file",
      });
    }
  }
};
