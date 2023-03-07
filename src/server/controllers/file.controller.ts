import { TRPCError } from "@trpc/server";
import { TGetOneFile, TCreateFile, TUpdateFile } from "../../schemas/file";
import {
  createFileService,
  deleteFileService,
  findUniqueFileService,
  saveFile,
} from "../services/file.service";
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
export const getSingleFileHandler = async ({
  input,
}: {
  input: TGetOneFile;
}) => {
  try {
    const file = await findUniqueFileService({ fileId: input.id });
    if (!file) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "File not found",
      });
    }
    return {
      status: "success",
      data: file,
    };
  } catch (error) {
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

export const updateFileHandler = async (input: TUpdateFile) => {
  try {
    console.log("IN", input);
    const file = await findUniqueFileService({ fileId: input.id });
    if (!file) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "File not found",
      });
    }
    const updatedFile = await saveFile(input);
    if (!updatedFile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Couldn't update/save file",
      });
    }
    return {
      status: "success",
      data: updatedFile,
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    } else {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update file",
      });
    }
  }
};

export const deleteFileController = async ({ id }: TGetOneFile) => {
  try {
    const file = await findUniqueFileService({ fileId: id });
    if (!file) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "File not found",
      });
    }
    await deleteFileService({ id });
    return {
      status: "success",
      data: {},
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    } else {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete file",
      });
    }
  }
};
