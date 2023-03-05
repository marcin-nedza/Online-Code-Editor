import React, { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";
type SimpleFile ={
    id:string,
    title:string
}
type TProjectPageContext = {
    isAddUserOpen: boolean;
    setAddUserMenuOpen:Dispatch<SetStateAction<boolean>> 
    selectedOption: 'project' | 'option';
    setSelectedOption: Dispatch<SetStateAction<"project" | "option">>;
    position:number;
    setPosition: Dispatch<SetStateAction<number>>;
}
export const ProjectPageContext = createContext<TProjectPageContext>({
    isAddUserOpen: false,
    setAddUserMenuOpen: () => { },
    selectedOption: 'project',
 setSelectedOption: () => {},
    position:0,
    setPosition:()=>{},

})
type ProjectProps={
    children:ReactNode
}
const ProjectPageProvider= ({ children }:ProjectProps) => {
   const [position,setPosition]=useState(0) 
    const [isAddUserOpen, setAddUserMenuOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState<'project' | 'option'>('project')
    return <ProjectPageContext.Provider value={ { isAddUserOpen,position,setPosition, selectedOption, setAddUserMenuOpen, setSelectedOption}}>{ children }</ProjectPageContext.Provider>
}
export default ProjectPageProvider
