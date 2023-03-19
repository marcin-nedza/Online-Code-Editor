import { File, Prisma, Project } from "@prisma/client";
import { useEffect } from "react";
import { TChangeStatus2 } from "../../schemas/project";
import { api } from "../../utils/api";
import Invitation from "./Invitation";
import SingleProject from "./SingleProject";
type Props = {
    project: Project & {
        files: File[];
    } | undefined

    isProjectFetched: boolean;
};
const Sidebar = ({ isProjectFetched, project }: Props) => {
    const { mutate: changeStatus } = api.project.changeStatus.useMutation();
    const {
        data: projects,
        mutate,
        isSuccess: isProjectsSuccess,
    } = api.project.getAssignedProjectByStatus.useMutation();

    const {
        data: acceptedProjects,
        mutate: findAcceptedProjects,
        isSuccess: isAcceptedProject,
    } = api.project.getAssignedProjectByStatus.useMutation();
    const handleChangePendingProject = ({
        projectId,
        status,
    }: TChangeStatus2) => {
        changeStatus({ projectId, status });
    };
    useEffect(() => {
        mutate({ status: "PENDING" });
        findAcceptedProjects({ status: "ACCEPTED" });
    }, [mutate, findAcceptedProjects]);
    return (
        <div className="flex   w-[var(--sidebar-w)] bg-dark-bg text-xs text-white ">
            <div className="basis-1/4 bg-main-bg"></div>
            <div className="flex flex-col justify-between text-center basis-3/4">
                <div className="h-1/2">
                    <div className="flex h-[var(--sidebar-title-h)] items-center bg-main-bg">
                        <p className="">Project</p>
                    </div>
                    <div className="text-start">
                        {isProjectFetched && (
                            <SingleProject
                                key={project.id}
                                title={project.title}
                                id={project.id}
                                files={project.files}
                            />
                        )}
                    </div>
                </div>
                <div className="h-[calc(var(--terminal-h)_+_var(--sidebar-title-h))]">
                    <div className="flex h-[var(--sidebar-title-h)] items-center bg-main-bg ">
                        <p className="">Invitations</p>
                    </div>
                    <div className="pt-2 text-start">
                        {isProjectsSuccess &&
                            projects.data.length > 0 &&
                            projects.data.map((el) => (
                                <Invitation
                                    key={el.project.id}
                                    title={el.project.title}
                                    id={el.project.id}
                                    onClick={handleChangePendingProject}
                                />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
