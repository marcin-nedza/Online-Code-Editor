import { Project, User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  ICreateProject,
  ICreateProjectInput,
  IGetOneProjectSchema,
  TAssignUserToProject,
  TGetAssignedProjects,
  TGetAssignedProjectsByStatus,
  TUpdatedProject,
  TChangeStatus,
} from "../../schemas/project";
import { Context } from "../api/trpc";
import { findUniqueProject } from "../repository/project.repository";
import {
  assignUserToProjectService,
  changeColaboratorStatusService,
  createProjectService,
  getAllProject,
  getAssignedProjectByStatus,
  saveProject,
} from "../services/project.service";
import { findUniqueUser } from "../services/user.service";

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
        const assingedProjects=await getAssignedProjectByStatus({userId:user.id,status:'ACCEPTED'})
    return {
      status: "success",
      data: projects as Project[],
    };
  } catch (error) {
    throw error;
  }
};

export const getAllAssignedProjectsHandler = async ({
  userId,
  status,
}: TGetAssignedProjectsByStatus) => {
  try {
    const projects = await getAssignedProjectByStatus({ userId, status });
    if (!projects) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to fetch all projects",
      });
    }
    return {
      status: "success",
      data: projects,
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    } else {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch projects",
      });
    }
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
export const updateProjectHandler = async (input: TUpdatedProject) => {
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
    if (error instanceof TRPCError) {
      throw error;
    } else {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update project",
      });
    }
  }
};
export const assignUserToProjectHandler = async ({
  projectId,
  email,
}: {
  projectId: string;
  email: string;
}) => {
  try {
    const colaborator = await findUniqueUser({ email: email });

    if (!colaborator) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `User with email ${email} not found`,
      });
    }
    const project = await assignUserToProjectService({
      userId: colaborator.id,
      projectId: projectId,
    });

    return {
      status: "success",
      data: project,
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    } else {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to assign user to project",
      });
    }
  }
};

export const changeProjectStatusHandler = async (input: TChangeStatus) => {
  try {
    const project = await changeColaboratorStatusService(input);
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
    if (error instanceof TRPCError) {
      throw error;
    } else {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to change project status",
      });
    }
  }
};
