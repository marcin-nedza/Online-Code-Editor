import { Prisma, Project, Status } from "@prisma/client";
import { ICreateProject } from "../../schemas/project";

import { prisma } from "../db";

export const createProject = (data: ICreateProject) => {
  return prisma.project.create({ data });
};

export const findUniqueProject = async (
  where: Prisma.ProjectWhereUniqueInput,
  select?: Prisma.ProjectSelect
) => {
  return (await prisma.project.findUnique({
    where,
    select,
  })) as Project;
};

export const findManyProjects = async (
  where: Prisma.ProjectWhereInput,
  select?: Prisma.ProjectSelect
) => {
  return await prisma.project.findMany({
    where,
    select,
  });
};
export const findAssignedProjectByStatus=async(
    {where}:{where:Prisma.ColaboratorsOnProjectWhereInput}
)=>{
    return await prisma.colaboratorsOnProject.findMany({
        where
    })
}
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
  colaboratorId,
}: {
  projectId: string;
  colaboratorId: string;
}) => {
  return await prisma.colaboratorsOnProject.create({
    data: {
      projectId,
      userId: colaboratorId,
      status: "PENDING",
    },
  });
};
export const findColaborators = async ({
  where,
}: {
  where: Prisma.ColaboratorsOnProjectWhereUniqueInput;
}) => {

  return await prisma.colaboratorsOnProject.findUnique({
    where,
  });
};
export const changeColaboratorStatus = async ({
  where,
  status,
}: {
  where: Prisma.ColaboratorsOnProjectWhereUniqueInput;
  status: Status;
}) => {
  return await prisma.colaboratorsOnProject.update({
    where: where,
    data: {
      status,
    },
  });
};
