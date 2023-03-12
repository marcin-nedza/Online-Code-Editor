import React from "react";
import { Navbar, Sidebar } from "../../components";
import AnotherProjectBar from "../../components/ProjectBar/AnotherProjectBar";
import ProjectPageProvider from "../../contexts/projectPageContext";
import {api} from "../../utils/api";

const index = () => {

  return (

    <ProjectPageProvider>
    <div className="flex w-screen bg-gray-200">
      <div className="flex flex-col w-full">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <div className="flex flex-col">
            <AnotherProjectBar projectTitle={""}>
              <div className="flex bg-gray-200">
                <div className="relative min-h-[calc(100vh_-_(var(--navbar-h)_+_var(--sidebar-title-h)))]
                               w-[calc(100vw_-_var(--sidebar-w))] bg-[#282c34] ">
                                </div>
              </div>
            </AnotherProjectBar>
          </div>
        </div>
      </div>
    </div>
    </ProjectPageProvider>
  );
};

export default index;
