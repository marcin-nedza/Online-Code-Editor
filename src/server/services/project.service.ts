import { Status, User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  ICreateProject,
  TAssignUserToProject,
  TUpadeteProjectSchema,
} from "../../schemas/project";
import {
  assignUserToProject,
  createProject,
  findAssignedProjectByStatus,
  findColaborators,
  findManyProjects,
  updateProject,
} from "../repository/project.repository";
import { findUniqueUser } from "./user.service";

export const createProjectService = async (input: ICreateProject) => {
  const user = await findUniqueUser({ id: input.userId });
  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  return await createProject(input);
};

export const getAllProject = async (userId: string) => {
  return await findManyProjects({ userId });
};
export const getAssignedProjectByStatus = async ({
  userId,
  status,
}: {
  userId: string;
  status: Status;
}) => {
  return await findAssignedProjectByStatus({ where: { userId, status } });
};
export const saveProject = async (input: TUpadeteProjectSchema) => {
  return await updateProject({ id: input.id }, input.content);
};

export const assignUserToProjectService = async (input: {
  projectId: string;
  colaboratorId: string;
}) => {
  const isAssigned = await findColaborators({
    where: {
      userId_projectId: {
        projectId: input.projectId,
        userId: input.colaboratorId,
      },
    },
  });
  if (isAssigned) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User already assigned to project",
    });
  }
  try {
    return await assignUserToProject({
      colaboratorId: input.colaboratorId,
      projectId: input.projectId,
    });
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to assign user to project",
    });
  }
};
