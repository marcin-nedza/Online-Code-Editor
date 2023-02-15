import { Prisma, Project } from "@prisma/client";
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
export const updateProject = async (
  where: Prisma.ProjectWhereUniqueInput,
  content: string
) => {
  return await prisma.project.update({
    data: { content },
    where,
  });
};
