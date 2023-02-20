import React, { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

type TProjectPageContext = {
    isAddUserOpen: boolean;
    setAddUserOpen:Dispatch<SetStateAction<boolean>> 
    selectedOption: 'project' | 'option';
    setSelectedOption: Dispatch<SetStateAction<"project" | "option">>
}
export const ProjectPageContext = createContext<TProjectPageContext>({
    isAddUserOpen: false,
    setAddUserOpen: () => { },
    selectedOption: 'project',
    setSelectedOption: () => {},

})
type ProjectProps={
    children:ReactNode
}
const ProjectPageProvider= ({ children }:ProjectProps) => {
    const [isAddUserOpen, setAddUserOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState<'project' | 'option'>('project')

    return <ProjectPageContext.Provider value={ { isAddUserOpen, selectedOption, setAddUserOpen, setSelectedOption}}>{ children }</ProjectPageContext.Provider>
}
export default ProjectPageProvider
