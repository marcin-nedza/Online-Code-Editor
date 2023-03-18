import { ColaboratorsOnProject, File, Project } from "@prisma/client";
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
};

export const ManageProjectContext = createContext<ManageProjectContextType>({
  project: undefined,
  setProject: () => {},
  fetchProject: () =>{},
  result: undefined,
  isSuccess: false,
});

type Props = {
  children: ReactNode;
};
const ManageProjectProvider = ({ children }: Props) => {
  const [project, setProject] = useState<TProject>();
  const [result, setResult] = useState<Result>();
  const { mutate: getProject, isSuccess, } =
    api.project.getSingleProject.useMutation();

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
      }}
    >
      {children}
    </ManageProjectContext.Provider>
  );
};
export default ManageProjectProvider;
