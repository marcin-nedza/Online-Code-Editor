import { useRouter } from "next/router";
import React, { useRef } from "react";
import { Navbar, Sidebar } from "../../components";
import AnotherProjectBar from "../../components/ProjectBar";
import ProjectPageProvider from "../../contexts/projectPageContext";
import { api } from "../../utils/api";

const index = () => {
  const { data ,refetch} = api.project.getAllProject.useQuery();
  const { mutate: createProject, isSuccess: isCreatedProjectSuccess } =
    api.project.createProject.useMutation();

  const ref = useRef<HTMLInputElement>(null);

  const handleCreateProject = (e: any) => {
    e.preventDefault();
    if (ref.current?.value) {
      createProject({ title: ref.current.value },{
                onSuccess:()=>{
                    refetch().catch(err=>console.log(err))
                }
            });
    }
  };

  const router = useRouter();

  const redirectToProject = async (id: string) => {
    await router.push(`/project/${id}`);
  };
  return (
    <ProjectPageProvider>
      <div className="flex w-screen bg-gray-200">
        <div className="flex flex-col w-full">
          <Navbar />
          <div className="flex">
            <div className="flex flex-col">
              <AnotherProjectBar projectTitle={""} isHomePage={true}>
                <div className="flex bg-gray-200">
                  <div
                    className="relative min-h-[calc(100vh_-_(var(--navbar-h)_+_var(--sidebar-title-h)))]
                               w-[100vw] bg-[#282c34] "
                  >
                    <div className="flex items-center justify-center h-full">
                      <div className="flex flex-col w-full h-full pb-3 text-sm text-white border sm:w-1/3 sm:h-2/3 border-accent bg-secondary">
                        <form className="px-2" onSubmit={handleCreateProject}>
                          <p className="py-2 text-center bg-secondary">Create new project</p>
                          <input
                            ref={ref}
                            className="w-full py-2 text-center text-white border border-l-0 border-r-0 outline-none border-accent bg-main-bg hover:bg-accent2"
                          />
                          <button className="w-full py-1 text-center outline-none bg-accent2 hover:bg-blue-accent">
                            Create
                          </button>
                        </form>
                        <div className="px-2 mt-20 overflow-y-scroll sm:mt-10 scrollbar-hide">
                          <p className="py-2 text-center bg-secondary">Open Project</p>
                          {data?.data.map((el) => (
                            <p
                              onClick={() => redirectToProject(el.id)}
                              key={el.id}
                              className="w-full px-3 py-1 text-center border border-l-0 border-r-0 cursor-pointer border-accent bg-main-bg hover:bg-accent2"
                            >
                              {el.title}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
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
