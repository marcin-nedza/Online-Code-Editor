import { ColaboratorsOnProject, Project } from "@prisma/client";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

type TProject = (Project & {
    colaborations: ColaboratorsOnProject[];
}) | undefined;
type ManageProjectContextType = {
    project: TProject
    setProject: Dispatch<SetStateAction<TProject>>
}


export const ManageProjectContext = createContext<ManageProjectContextType>({
    project: undefined,
    setProject: () => { }
})

type Props = {
    children: ReactNode
}
const ManageProjectProvider = ({children}: Props) => {
    const [project, setProject] = useState<TProject>()
    return (
    <ManageProjectContext.Provider
      value={{
                project,setProject
            }}
    >
      {children}
    </ManageProjectContext.Provider>
  );
};
export default ManageProjectProvider
