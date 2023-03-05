import { useEffect } from "react";
import {SimpleFile} from "../../schemas/file";
import { TChangeStatus } from "../../schemas/project";
import { api } from "../../utils/api";
import Invitation from "./Invitation";
import SingleProject from "./SingleProject";
type Props={
    files:SimpleFile[]

}
const Sidebar = ({files}:Props) => {
  const { mutate: changeStatus } = api.project.changeStatus.useMutation();
  const { data, isSuccess } = api.project.getAllProject.useQuery();
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
  const handleChangePendingProject = ({ projectId, status }: TChangeStatus) => {
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
            <p className="">Projects</p>
          </div>
          <div className="text-start">
            {isSuccess &&
              data.data.map((el) => (
                <SingleProject
                  key={el.id}
                  title={el.title}
                  id={el.id}
                  files={el.files}
                    tabFiles={files}
                />
              ))}
          </div>
        </div>
        <div className="h-1/2">
          <div className="flex h-[var(--sidebar-title-h)] items-center bg-main-bg ">
            <p className="">Colaboration</p>
          </div>
          <div className="h-1/2 text-start">
            {isAcceptedProject &&
              acceptedProjects.data.map((el) => (
                <SingleProject
                  key={el.project.id}
                  title={el.project.title}
                  id={el.project.id}
                  files={el.project.files}
                    tabFiles={files}
                />
              ))}
          </div>
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
