import {User} from "@prisma/client";
import {TRPCError} from "@trpc/server";
import {ICreateProject,TAssignUserToProject,TUpadeteProjectSchema} from "../../schemas/project";
import {assignUserToProject, createProject,findManyProjects,updateProject} from "../repository/project.repository";
import {findUniqueUser} from "./user.service";


export const createProjectService=async(input:ICreateProject) =>{
    console.log('INPUT',input)
    const user = await findUniqueUser({id:input.userId})
    if(!user) {
        throw new TRPCError({
            code:"NOT_FOUND",
            message:"User not found"
        })
    }

    return await createProject(input)
}

export const getAllProject=async(userId:string)=>{
    return await findManyProjects({userId})
}

export const saveProject=async(input:TUpadeteProjectSchema) =>{
    return await updateProject({id:input.id},input.content) 
}
export const assignUserToProjectService=async(input:{projectId:string,colaboratorId:string})=>{
    console.log('INPUT',input)
    return await assignUserToProject({colaboratorId:input.colaboratorId,projectId:input.projectId})
}
