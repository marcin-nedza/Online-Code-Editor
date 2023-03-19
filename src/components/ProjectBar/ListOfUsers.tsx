import { ColaboratorsOnProject, Project, User } from "@prisma/client";
import { useContext, useRef, useState } from "react";
import { ManageProjectContext } from "../../contexts/manageProjectContext";
import useOutsideAlerter from "../../hooks/useComponentVisible";
import { api } from "../../utils/api";
import Modal from "./Modal";


const ListOfUsers = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState("");

  const { fetchProject, result: singleProjectData } =
    useContext(ManageProjectContext);
  const project = singleProjectData?.data;

  const { mutate: removeUser } = api.project.deleteColaboration.useMutation();

  const ref = useRef(null);

  useOutsideAlerter(ref, setOpen);

  const handleRemoveUser = (user: string) => {
    if (!project?.id) {
      return;
    }
    removeUser(
      { userId: user, projectId: project?.id },
      {
        onSuccess: () => {
          fetchProject(project.id);
        },
      }
    );
  };
  return (
    <div className=" relative flex min-h-[50vh] w-2/3 flex-col px-2 text-sm md:flex-row">
      <div className="basis-1/2">
        <p className="pb-1 border-b border-b-accent">Users assigned </p>
        <div className="min-h-full pt-2 pr-2 md:border-r md:border-r-accent">
          {project?.colaborations.map((user) => {
            if (user.status === "ACCEPTED") {
              return (
                <div
                  key={user.userId}
                  className="flex justify-between py-1 cursor-pointer hover:bg-accent"
                >
                  <p className="pl-2">{user.user.username}</p>
                  <span
                    onClick={() => {
                      setOpen(!open);
                      setUser(user.userId);
                    }}
                    className="mr-3 cursor-pointer"
                  >
                    &#10005;
                  </span>
                </div>
              );
            }
            return null;
          })}
          {open && (
            <Modal
              onclose={setOpen}
              text="Remove user?"
              onClick={() => handleRemoveUser(user)}
            />
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
