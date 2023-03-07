import React, { useRef, useState } from "react";
import useOutsideAlerter from "../../hooks/useComponentVisible";
import {api} from "../../utils/api";
type Props = {
  projectTitle: string;
  fileTitle: string;
    fileId:string
    closeTab:(id:string)=>void
};
const Pathbar = ({ fileTitle, projectTitle,fileId ,closeTab}: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutsideAlerter(ref, setOpen);
    const {mutate:deleteFile}=api.file.deleteFile.useMutation()
  return (
    <div
      className="flex  h-[var(--pathbar-h)] items-center
                    justify-between border-b-[1px] border-accent2 bg-light-bg text-xs text-white "
    >
      <p className="ml-3">{` ${projectTitle}>${fileTitle}`}</p>
      <div className="relative">
        <div
          onClick={() => setOpen(!open)}
          className="mr-3 text-lg cursor-pointer"
        >
          &#8861;
        </div>
        {open && (
          <div
            ref={ref}
            className="absolute top-0 z-10 w-32 p-3 border right-10 border-accent bg-accent"
          >
            <p className="text-center">Delete File?</p>
            <div className="flex justify-around px-4 pt-2">
              <div onClick={()=>{
                                deleteFile({id:fileId})
                                closeTab(fileId)
                            }}
                                className="flex h-6 w-6 cursor-pointer items-center justify-center text-[1rem] hover:bg-red-400">
                &#10003;
              </div>
              <div onClick={() => setOpen(false)}className="flex h-6 w-6 cursor-pointer items-center justify-center text-[1rem] ">
                &#9747;
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pathbar;
