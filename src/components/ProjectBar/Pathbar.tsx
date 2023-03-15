import React, { useRef, useState } from "react";
import useOutsideAlerter from "../../hooks/useComponentVisible";
import Modal from "./Modal";

type Props = {
  projectData: {
    projectTitle: string;
    fileTitle: string | undefined;
    fileId: string;
  };
  handleDeleteFile: (fileId: string) => void;
};
const Pathbar = ({ projectData, handleDeleteFile }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutsideAlerter(ref, setOpen);
  return (
    <div
      className="flex  h-[var(--pathbar-h)] items-center
                    justify-between border-b-[1px] border-accent2 bg-light-bg text-xs text-white "
    >
      <p className="ml-3">{` ${projectData.projectTitle}>${
        projectData.fileTitle ?? ""
      }`}</p>
      <div className="relative">
        {projectData.fileTitle && (
          <div
            onClick={() => setOpen(!open)}
            className="mr-3 text-lg cursor-pointer"
          >
            &#8861;
          </div>
        )}
        {open && (
          <Modal
            text="Delete File?"
            onclose={setOpen}
            onClick={() => handleDeleteFile(projectData.fileId)}
          />
        )}
      </div>
    </div>
  );
};

export default Pathbar;
// <div
//           ref={ref}
//           className="absolute top-0 z-10 w-32 p-3 border border-accent-light right-10 bg-accent"
//         >
//           <p className="text-center">Delete File?</p>
//           <div className="flex justify-around px-4 pt-2">
//
//             <div
//               onClick={() => {
//                 handleDeleteFile(projectData.fileId);
//                 setOpen(false);
//               }}
//               className="flex h-6 w-6 cursor-pointer items-center justify-center text-[1rem] hover:bg-red-400"
//             >
//               &#10003;
//             </div>
//             <div
//               onClick={() => setOpen(false)}
//               className="flex h-6 w-6 cursor-pointer items-center justify-center text-[1rem] "
//             >
//               &#9747;
//             </div>
//           </div>
//         </div>
//
