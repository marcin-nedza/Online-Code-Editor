import { ColaboratorsOnProject, Project } from "@prisma/client";
import { useState } from "react";
import AssingUsers from "./AssingUsers";
import ListOfUsers from "./ListOfUsers";

type Props = {
  isHomePage: boolean;
};
const ManageProject = ({ isHomePage }: Props) => {
  type Option = "assign" | "list";

  const [activeOption, setActiveOption] = useState<Option>("assign");
  return (
    <div
      className={`flex min-h-[calc(100vh_-_(var(--navbar-h)_+_var(--sidebar-title-h))_-_1px)]
                       bg-main-bg 
                      text-white 
            ${
              isHomePage
                ? "w-[100vw]"
                : "min-w-[calc(100vw_-_var(--sidebar-w))]"
            }
            `}
    >
      <div className="basis-1/5 border-r-[1px] border-accent ">
        <div
          onClick={() => setActiveOption("assign")}
          className={`cursor-pointer border p-2 text-sm hover:border hover:border-r-0 hover:border-accent ${
            activeOption === "assign"
              ? "border-r-0 border-accent "
              : "border-transparent "
          }`}
        >
          Assign users
        </div>
        <div
          onClick={() => setActiveOption("list")}
          className={`cursor-pointer border p-2 text-sm hover:border hover:border-r-0 hover:border-accent ${
            activeOption === "list"
              ? "border-r-0 border-accent "
              : "border-transparent "
          }`}
        >
          List Of Users
        </div>
      </div>
      <div className="p-2 basis-4/5">
        {activeOption === "assign" && <AssingUsers />}
        {activeOption === "list" && <ListOfUsers />}
      </div>
    </div>
  );
};

export default ManageProject;
