import React from "react";
import { Navbar, Sidebar } from "../../components";
import AnotherProjectBar from "../../components/ProjectBar/AnotherProjectBar";
import File from "../../components/TEST/File";

const index = () => {
  return (
    <div className="flex w-screen bg-gray-200">
      <div className="flex flex-col w-full">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <div className="flex flex-col">
            <AnotherProjectBar projectTitle={""}>
              <div className="flex bg-gray-200">
                <div className="relative min-h-[calc(100vh_-_(var(--navbar-h)_+_var(--sidebar-title-h)_+_var(--terminal-h)_+_var(--pathbar-h))_-_1px)] w-full bg-[#282c34]"></div>
              </div>
            </AnotherProjectBar>
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
