import { useRouter } from "next/router";
import React from "react";
import { api } from "../../utils/api";
// #002b36
const Sidebar = () => {
  const router = useRouter();
  const redirect = (id: string) => {
    router.push(`/project/${id}`);
  };
  const { data, isSuccess } = api.project.getAllProject.useQuery();
  return (
    <div className="flex w-[var(--sidebar-w)] bg-dark-bg text-xs text-white ">
      <div className="basis-1/4 bg-main-bg"></div>
      <div className="flex-col text-center basis-3/4">
        <div className="flex h-[var(--sidebar-title-h)] items-center bg-main-bg">
          <p className="">Projects</p>
        </div>
        <div className="pt-2 text-start">
          {isSuccess &&
            data.data.map((el) => (
              <div
                key={el.id}
                className="relative w-full cursor-pointer hover:bg-accent2"
              >
                <div
                  onClick={() => redirect(el.id)}
                  className="
                                    before:invisible 
                            before:absolute before:left-3/4 before:-bottom-2 before:z-10 
                            before:w-max 
                                before:max-w-xs
                            before:-translate-y-1/2 
                            before:rounded-lg before:bg-gray-700 before:px-2 
                            before:py-1.5 before:text-white before:content-[attr(data-tip)] 
                            after:invisible after:absolute after:left-2/4 after:translate-x-1 after:bottom-1 after:z-10 after:-rotate-90 
                            after:h-0 after:w-0 after:-translate-y-1/2 after:border-8 
                            after:border-b-gray-700 after:border-l-transparent after:border-t-transparent 
                            after:border-r-transparent hover:before:visible hover:after:visible"
                  //                 data-tip="Improved Workflow"
                  data-tip={el.title}
                >
                  <p className="w-[50px] overflow-hidden text-ellipsis whitespace-nowrap py-1 pl-2">
                    {el.title}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
