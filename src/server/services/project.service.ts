import { Status, User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  ICreateProject,
  TChangeStatus,
  TGetAssignedProjects,
  TUpdatedProject,
} from "../../schemas/project";
import {
  assignUserToProject,
  changeColaboratorStatus,
  createProject,
  deleteColaboratorsOnProject,
  findAssignedProjectByStatus,
  findColaborators,
  findManyProjects,
  findUniqueProject,
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


export const findUniqueProjectService = async ({
    projectId
}:{
        projectId: string | undefined
    }) => {
    if(!projectId) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Project id not provided",
    });
    }
  return await findUniqueProject({ id: projectId });
};
export const getAssignedProjectByStatus = async ({
  userId,
  status,
}: {
  userId: string;
  status: Status;
}) => {
  return await findAssignedProjectByStatus({ userId, status });
};

//TODO: change this to file
export const saveProject = async ({ content, id }: TUpdatedProject) => {
  return await updateProject({ id }, content);
};

export const assignUserToProjectService = async ({
  userId,
  projectId,
}: TGetAssignedProjects) => {
  const collaboration = { projectId, userId };

  const project = await findUniqueProject({ id: projectId });

  const isAssigned = await findColaborators({
    userId_projectId: collaboration,
  });

  if (isAssigned || project?.userId === userId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User already assigned to project",
    });
  }

  try {
    return await assignUserToProject(collaboration);
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to assign user to project",
    });
  }
};

export const changeColaboratorStatusService = async ({
  projectId,
  userId,
  status,
}: TChangeStatus) => {
  try {
    const project = await findColaborators({
      userId_projectId: { projectId, userId },
    });
    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found",
      });
    }
    return changeColaboratorStatus(
      { userId_projectId: { projectId, userId } },
      status
    );
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Couldnt change project status",
    });
  }
};

export const deleteColaboratorsOnProjectService = async ({
  projectId,
  userId,
}: TGetAssignedProjects) => {
  try {
    const project = await findColaborators({
      userId_projectId: { projectId, userId },
    });
    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Collaboration not found",
      });
    }
    return deleteColaboratorsOnProject({
      userId_projectId: { projectId, userId },
    });
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Couldnt delete collaboration ",
    });
  }
};
