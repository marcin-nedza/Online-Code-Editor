import { useRouter } from "next/router";
import React, { useState } from "react";
import { TChangeStatus } from "../../schemas/project";

type Props = {
  id: string;
  title: string;
  onClick: (input: TChangeStatus) => void;
};
const Invitation = ({ id, title, onClick }: Props) => {
  const router = useRouter();
  const redirect = (id: string) => {
    router.push(`/project/${id}`);
  };
  const [open, setOpen] = useState(false);
  return (

    <div className="relative w-full cursor-pointer hover:bg-accent2">
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
                            after:translate-x-6 after:-translate-y-1/2 after:-rotate-90 after:border-8 
                            after:border-b-gray-700 after:border-l-transparent after:border-t-transparent 
                            after:border-r-transparent hover:before:visible hover:after:visible"
        data-tip={title}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
          <p className="w-[50px] overflow-hidden text-ellipsis whitespace-nowrap py-1 pl-2">
            {title}
          </p>
        { open && (
          <div className="flex gap-4 pb-1 pl-2 text-[1rem]">
            <p
              onClick={() => onClick({ projectId: id, status: "ACCEPTED" })}
              className="p-0.5 px-1 hover:bg-dark-bg"
            >
              &#x2713;
            </p>
            <p
              onClick={() => onClick({ projectId: id, status: "REJECTED" })}
              className="p-0.5 hover:bg-dark-bg"
            >
              &#x2715;
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invitation;
