import File from "./File";
import { useRouter } from "next/router";
import React, { useState } from "react";

type Props = {
  id: string;
  title: string;
  files?: File[];
};
const SingleProject = ({ id, title, files }: Props) => {
  const router = useRouter();
  const redirect = (id: string) => {
    router.push(`/project/${id}`);
  };
  const isFilesPresent = files?.length > 0;
  const [open, setOpen] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  console.log("FOLDEr", folderOpen);
  return (
    <div className="">
      <div className="relative w-full cursor-pointer hover:bg-accent2">
        <div
          onClick={() => {}}
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
          <div className="flex">
            <p
              onClick={() => setFolderOpen(!folderOpen)}
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
      {isFilesPresent && folderOpen &&
        files?.map((file) => <File key={file.id} file={file} />)}
            <div onClick={()=>setOpen(!open)} className="cursor-pointer">

        {open?(
                <div className="">

        <input/>
                </div>
        ):(
            <p  className="w-full text-center">+</p>
        )} 
            </div>
    </div>
  );
};

export default SingleProject;
