import React, {  useContext, useRef, useState } from "react";
import {ManageProjectContext} from "../../contexts/manageProjectContext";
import useOutsideAlerter from "../../hooks/useComponentVisible";
import { api } from "../../utils/api";
import File from "./File";

type Props = {
  id: string;
  title: string;
  files?: File[];
};
const SingleProject = ({ id, title, files }: Props) => {
  const isFilesPresent = files?.length > 0;
  const [open, setOpen] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const {
        getOneProject
  } = useContext(ManageProjectContext);
    const {refetch} =getOneProject(id)
  const { mutate } = api.file.createFile.useMutation({
       
        
    onSuccess: () => {
      setFileName("");
      setOpen(false);
            refetch()
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    mutate({ title: fileName, projectId: id });
  };
  const ref = useRef(null);

  useOutsideAlerter(ref, setOpen);

  const filesWithActiveState = files?.map((el) => {
    return { ...el, active: false };
  });
  return (
    <div className="">
      <div
        className={`relative h-[var(--sidebar-title-h)] w-full cursor-pointer  border hover:bg-accent2 ${
          folderOpen ? "border-accent" : "border-transparent"
        }`}
      >
        <div
          className=" before:invisible 
                            before:absolute before:left-3/4 before:-bottom-2 before:z-10 
                            before:w-max 
                            before:max-w-xs
                            before:translate-x-5
                            before:-translate-y-1/2 
                            before:rounded-lg before:bg-gray-700 before:px-3 
                            before:py-1.5 before:text-white before:content-[attr(data-tip)] 
                            after:invisible after:absolute after:left-2/4 after:bottom-1 after:z-10 after:h-0 after:w-0 
                            after:translate-x-7 after:-translate-y-1/2 after:-rotate-90 after:border-8 
                            after:border-b-gray-700 after:border-l-transparent after:border-t-transparent 
                            after:border-r-transparent hover:before:visible hover:after:visible"
          data-tip={title}
        >
          <div
            className={`flex h-[calc(var(--sidebar-title-h)_-_1px)] items-center justify-center ${
              folderOpen ? "border-b-accent  bg-accent2 " : ""
            }`}
          >
            <p
              onClick={() => {
                setFolderOpen(!folderOpen);
              }}
              className="flex items-center w-5 pl-1"
            >
              {folderOpen ? <>&#8627;</> : <>&gt;</>}
            </p>
            <p className="w-[50px] overflow-hidden text-ellipsis whitespace-nowrap py-1 pl-2">
              {title}
            </p>
          </div>
        </div>
      </div>
      {isFilesPresent &&
        folderOpen &&
        filesWithActiveState?.map((file) => (
          <File
            key={file.id}
            file={file}
          />
        ))}
      {folderOpen && !open && (
        <div
          onClick={() => setOpen(!open)}
          className="text-center cursor-pointer hover:bg-accent2"
        >
          +
        </div>
      )}
      {open && (
        <form onSubmit={handleSubmit} ref={ref} className="w-10">
          <input
            autoFocus
            onChange={(e) => setFileName(e.target.value)}
            className="py-1 pl-2 border-t border-b border-transparent outline-none bg-main-bg focus:border-accent"
          />
        </form>
      )}
    </div>
  );
};

export default SingleProject;
