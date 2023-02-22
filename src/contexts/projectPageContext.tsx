import React, { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

type TProjectPageContext = {
    isAddUserOpen: boolean;
    setAddUserMenuOpen:Dispatch<SetStateAction<boolean>> 
    selectedOption: 'project' | 'option';
    setSelectedOption: Dispatch<SetStateAction<"project" | "option">>
}
export const ProjectPageContext = createContext<TProjectPageContext>({
    isAddUserOpen: false,
    setAddUserMenuOpen: () => { },
    selectedOption: 'project',
    setSelectedOption: () => {},

})
type ProjectProps={
    children:ReactNode
}
const ProjectPageProvider= ({ children }:ProjectProps) => {
    const [isAddUserOpen, setAddUserMenuOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState<'project' | 'option'>('project')
    return <ProjectPageContext.Provider value={ { isAddUserOpen, selectedOption, setAddUserMenuOpen, setSelectedOption}}>{ children }</ProjectPageContext.Provider>
}
export default ProjectPageProvider
