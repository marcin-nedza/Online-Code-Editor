import { ColaboratorsOnProject, Project } from "@prisma/client";
import {useRef, useState} from "react";
import useOutsideAlerter from "../../hooks/useComponentVisible";
import Modal from "./Modal";
type Props = {
  project:
    | (Project & {
        colaborations: (ColaboratorsOnProject & {
          user: {
            username: string;
            email: string;
          };
        })[];
      })
    | undefined;
};

const ListOfUsers = ({ project }: Props) => {
    const [open, setOpen] = useState(false)
 const ref = useRef(null);
  useOutsideAlerter(ref, setOpen);

  return (
    <div className=" relative flex min-h-[50vh] w-2/3 flex-col px-2 text-sm md:flex-row">
      <div className="basis-1/2">
        <p className="pb-1 border-b border-b-accent">Users assigned </p>
        <div className="min-h-full pt-2 md:border-r md:border-r-accent">
          {project?.colaborations.map((user) => {
            if (user.status === "ACCEPTED") {
              return (
                <div key={user.userId} className="flex justify-between">
                  <p>{user.user.username}</p>
                  <span onClick={()=>setOpen(!open)} className="mr-3 cursor-pointer">&#10005;</span>
                </div>
              );
            }
            return null;
          })}
  {open && (
        <Modal onclose={setOpen} text='Remove user?' onClick={()=>console.log('poszlo')}/> 
         )}

        </div>
      </div>
      <div className="basis-1/2">
        <p className="pb-1 border-b border-b-accent">Sent invitations </p>
        <div className="pt-2 md:pl-4">
          {project?.colaborations.map((user) => {
            if (user.status === "PENDING") {
              return <p key={user.userId}>{user.user.username}</p>;
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default ListOfUsers;
