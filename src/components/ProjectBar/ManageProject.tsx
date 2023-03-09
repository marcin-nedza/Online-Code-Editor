import React from "react";
import AssingUsers from "./AssingUsers";

const ManageProject = () => {

  return (
      <div className="bg-main-bg flex
                       min-h-[calc(100vh_-_(var(--navbar-h)_+_var(--sidebar-title-h)_+_var(--terminal-h))_-_1px)] 
                      text-white min-w-[calc(100vw_-_var(--sidebar-w))]">
        <div className="basis-1/5 border-r-[1px] border-accent ">
          <div className="p-2 border border-transparent cursor-pointer hover:border hover:border-accent">Assign users </div>
        </div>
        <div className="p-2 basis-4/5">
                <AssingUsers/>
            </div>
      </div>
  );
};

export default ManageProject;
