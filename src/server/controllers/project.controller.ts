import { Project } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  ICreateProject,
  ICreateProjectInput,
  IGetOneProjectSchema,
  TUpadeteProjectSchema,
} from "../../schemas/project";
import { Context } from "../api/trpc";
import { findUniqueProject } from "../repository/project.repository";
import {
  createProjectService,
  getAllProject,
  saveProject,
} from "../services/project.service";
//console
export const createProjectHandler = async ({
  input,
  ctx: { req, user },
}: {
  input: ICreateProjectInput;
  ctx: Context;
}) => {
  try {
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User required to create project",
      });
    }
    const project = await createProjectService({
      title: input.title,
      userId: user?.id,
    });
    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Could not create project",
      });
    }
    return {
      status: "success",
      data: project,
    };
  } catch (error: any) {
    throw error;
  }
};

export const getAllProjectHandler = async ({
  ctx: { user },
}: {
  ctx: Context;
}) => {
  try {
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User required to get projects",
      });
    }
    const projects = await getAllProject(user?.id);
    return {
      status: "success",
      data: projects as Project[],
    };
  } catch (error) {
    throw error;
  }
};
export const getOneProjectHandler = async ({
  input,
}: {
  input: IGetOneProjectSchema;
}) => {
  try {
    const project = await findUniqueProject({ id: input.id });
    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found",
      });
    }
    return {
      status: "success",
      data: project,
    };
  } catch (error) {
    throw error;
  }
};
export const updateProjectHandler = async (input: TUpadeteProjectSchema) => {
  try {
    const project = await findUniqueProject({ id: input.id });
    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found",
      });
    }
    const updatedProject = await saveProject(input);
    if (!updatedProject) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Couldn't update/save project",
      });
    }
    return {
      status: "success",
      data: updatedProject,
    };
  } catch (error) {
    throw error;
  }
};
