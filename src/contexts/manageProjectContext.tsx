import { ColaboratorsOnProject, File, Project } from "@prisma/client";
import { RefetchOptions, RefetchQueryFilters } from "@tanstack/react-query";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { api } from "../utils/api";

type TProject =
  | (Project & {
      colaborations: ColaboratorsOnProject[];
    })
  | undefined;
type Result = {
  status: string;
  data: Project & {
    colaborations: (ColaboratorsOnProject & {
      user: {
        username: string;
        email: string;
      };
    })[];
    files: File[];
  };
};
type ManageProjectContextType = {
  project: TProject;
  setProject: Dispatch<SetStateAction<TProject>>;
  fetchProject: (projectId: string) => void;
  result: Result | undefined;
  isSuccess: boolean;
  getOneProject: (projectId: string) => {
    data:
      | {
          status: string;
          data: Project & {
            colaborations: (ColaboratorsOnProject & {
              user: {
                username: string;
                email: string;
              };
            })[];
            files: File[];
          };
        }
      | undefined;
    refetch:()=> Promise<any>;
    isSuccess: boolean;
  };
};

export const ManageProjectContext = createContext<ManageProjectContextType>({
  project: undefined,
  setProject: () => {},
  fetchProject: () => {},
  result: undefined,
  isSuccess: false,
  getOneProject: () => {},
});

type Props = {
  children: ReactNode;
};
const ManageProjectProvider = ({ children }: Props) => {
  const [project, setProject] = useState<TProject>();
  const [result, setResult] = useState<Result>();
  const { mutate: getProject, isSuccess } =
    api.project.getSingleProject.useMutation();

  const getOneProject = (projectId: string | undefined) => {
   
    const { data, refetch, isSuccess } = api.project.getProjectQuery.useQuery({
      id: projectId,
    },{onSuccess:(val)=>setProject(val.data)});
            return { data, refetch, isSuccess };
  };

  const fetchProject = (projectId: string) => {
    getProject(
      { id: projectId },
      {
        onSuccess: (val) => {
          setResult(val);
        },
      }
    );
  };
  return (
    <ManageProjectContext.Provider
      value={{
        project,
        setProject,
        fetchProject,
        result,
        isSuccess,
        getOneProject,
      }}
    >
      {children}
    </ManageProjectContext.Provider>
  );
};
export default ManageProjectProvider;
