import { Prisma, Project, Status } from "@prisma/client";
import { ICreateProject } from "../../schemas/project";

import { prisma } from "../db";
type ProjectResult = Prisma.ProjectInclude;
export const createProject = (data: ICreateProject) => {
  return prisma.project.create({ data });
};

export const findUniqueProject = async (
  where: Prisma.ProjectWhereUniqueInput,
  select?: Prisma.ProjectSelect
) => {
  return await prisma.project.findUnique({
    where,
    include: {
      files: { orderBy: { createdAt: "desc" } },
      colaborations: {
        include: { user: { select: { email: true, username: true } } },
      },
    },
  });
};

export const findManyProjects = async (
  where: Prisma.ProjectWhereInput,
  select?: Prisma.ProjectSelect
) => {
  return await prisma.project.findMany({
    where,
    // select,
    include: { files: { orderBy: { createdAt: "desc" } } },
  });
};
export const findAssignedProjectByStatus = async (
  where: Prisma.ColaboratorsOnProjectWhereInput
) => {
  return await prisma.colaboratorsOnProject.findMany({
    where,
    include: { project: { include: { files: true } } },
  });
};

//TODO: change to file
export const updateProject = async (
  where: Prisma.ProjectWhereUniqueInput,
  content: string
) => {
  return await prisma.project.update({
    data: { content },
    where,
  });
};
export const assignUserToProject = async ({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) => {
  return await prisma.colaboratorsOnProject.create({
    data: {
      projectId,
      userId,
      status: "PENDING",
    },
  });
};

export const findColaborators = async (
  where: Prisma.ColaboratorsOnProjectWhereUniqueInput
) => {
  return await prisma.colaboratorsOnProject.findUnique({
    where,
  });
};

export const changeColaboratorStatus = async (
  where: Prisma.ColaboratorsOnProjectWhereUniqueInput,
  status: Status
) => {
  return await prisma.colaboratorsOnProject.update({
    where,
    data: { status },
  });
};


export const deleteColaboratorsOnProject= async(
    where:Prisma.ColaboratorsOnProjectWhereUniqueInput
)=>{
    return prisma.colaboratorsOnProject.delete({where})
}
