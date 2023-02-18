import React, { Dispatch, SetStateAction, useState } from "react";
import ManageProject from "./ManageProject";

type Props = {
    title: string;
    isAddUserOpen: boolean;
    setAddUsersMenuOpen: Dispatch<SetStateAction<boolean>>;
    children:React.ReactNode
};

const ProjectBar = ({ title, isAddUserOpen, setAddUsersMenuOpen,children }: Props) => {
    const [selectedOption, setSelectedOption] = useState("project");

    return (
        <div className="">

        <div className="">
            <div className="flex  h-[var(--sidebar-title-h)]  w-full items-center bg-dark-bg text-xs text-white">
                <div
                    onClick={() => setSelectedOption("project")}
                    className={`flex h-full min-w-[5rem] cursor-pointer items-center justify-center border-r border-dark-bg px-2 ${selectedOption === "project" ? "bg-accent" : "bg-light-bg"
                        } hover:bg-accent`}
                >
                    <p className="">{title}</p>
                    <div className="flex justify-center w-4 ml-1 text-sm hover:bg-light-bg">
                        &#x2715;
                    </div>
                </div>
                {isAddUserOpen && (
                    <div
                        onClick={() => setSelectedOption("option")}
                        className={`flex h-full cursor-pointer items-center border-r border-dark-bg px-2 ${selectedOption === "option" ? "bg-accent" : "bg-light-bg"
                            } hover:bg-accent`}
                    >
                        <p className="">Add User</p>
                        <div onClick={()=>setAddUsersMenuOpen(false)} className="flex justify-center w-4 ml-1 text-sm hover:bg-light-bg">
                            &#x2715;
                        </div>
                    </div>
                )}
            </div>
        </div>
              {selectedOption==='project' && children} 
              {selectedOption==='option' && (
             <ManageProject/> 
              )} 
        </div>
    );
};

export default ProjectBar;
