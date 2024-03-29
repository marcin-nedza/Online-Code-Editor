import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { ManageProjectContext } from "../../contexts/manageProjectContext";
import { ProjectPageContext } from "../../contexts/projectPageContext";
import { api } from "../../utils/api";
import ManageProject from "./ManageProject";
import Pathbar from "./Pathbar";

type Props = {
  children: React.ReactNode;
  projectTitle: string | undefined;
  isHomePage: boolean;
    projectId:string
};

const AnotherProjectBar = ({ children, projectTitle,projectId, isHomePage }: Props) => {
  const {
    fileTabsArray,
    closeTab,
    activateFileTab,
    tabId,
    setFileTabsArray,
    isAddUserOpen,
    setAddUserMenuOpen,
    setIsEmpty,
  } = useContext(ProjectPageContext);
  const { getOneProject } = useContext(ManageProjectContext);

  const { refetch } = getOneProject(projectId);
  const currentFileTitle = fileTabsArray.filter((el) => el.active)[0]?.title;
  const { mutate: deleteFile } = api.file.deleteFile.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleCloseTab = (fileId: string) => {
    const index = fileTabsArray.findIndex((file) => file.id === fileId);
    closeTab(fileId);
    if (index === 0 && fileTabsArray.length > 1) {
      activateFileTab(fileTabsArray[1]?.id);
      setIsEmpty(false);
    }
    if (index > 0 && index <= fileTabsArray.length - 1) {
      activateFileTab(fileTabsArray[index - 1]?.id);
      setIsEmpty(false);
    }
    if (index === 0 && fileTabsArray.length === 1) {
      setFileTabsArray([]);
      setIsEmpty(true);
    }
    if (isAddUserOpen) {
      setAddUserMenuOpen(false);
    }
  };

  const handleDeleteTab = (fileId: string) => {
    deleteFile({ id: fileId });
    handleCloseTab(fileId);
  };
  const projectData = {
    fileId: tabId,
    projectTitle: projectTitle ?? "",
    fileTitle: currentFileTitle,
  };
  return (
    <div className="h-full">
      <div
        className="flex  h-[var(--sidebar-title-h)]  w-full items-center
                        bg-dark-bg text-xs text-white"
      >
        {fileTabsArray?.map((el) => (
          <div
            key={el.id}
            onClick={() => {
              console.log("inds", el);
              activateFileTab(el.id);
            }}
            className={`flex h-full min-w-[5rem] cursor-pointer items-center justify-center border-r
                        border-dark-bg px-2 
                        ${el.active ? "bg-accent" : "bg-light-bg"}
                        hover:bg-accent`}
          >
            <p className="">{el.title}</p>
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleCloseTab(el.id);
              }}
              className="flex justify-center w-4 ml-1 text-sm hover:bg-light-bg"
            >
              &#x2715;
            </div>
          </div>
        ))}
      </div>
      <Pathbar projectData={projectData} handleDeleteFile={handleDeleteTab} />
      {isAddUserOpen ? <ManageProject isHomePage={isHomePage} /> : children}
    </div>
  );
};

export default AnotherProjectBar;
