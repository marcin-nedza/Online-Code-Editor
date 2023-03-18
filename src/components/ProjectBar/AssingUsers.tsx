import { useRouter } from "next/router";
import React, { useState } from "react";
import { api } from "../../utils/api";
import Spinner from "../Spinner";

const AssingUsers = () => {
  const router = useRouter();
  const projectId = router.query?.projectId as string;
  const [responseMsg, setResponseMsg] = useState("");
  const [email, setEmail] = useState("");
  const {
    mutate: assignUserToProject,
    isError,
    isSuccess,
    isLoading,
    reset,
  } = api.project.assignUserToProject.useMutation();
  const handleSubmit = (e: any) => {
    e.preventDefault();

    try {
      assignUserToProject(
        { email: email, projectId: projectId },
        {
          onError: (message) => {
            setResponseMsg(message.message);
          },
          onSuccess: () => {
            setResponseMsg("Invitation sent to user");
            setEmail("");
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex">
      <div className="">
        <p className="mb-2 text-sm">Enter users email</p>

        <form onSubmit={handleSubmit} className="flex">
          <input
            onChange={(e) => {
              reset();
              setEmail(e.target.value);
            }}
            value={email}
            placeholder="email"
            className="p-1 px-2 text-sm outline-none bg-accent2 caret-white"
          />
        </form>
      </div>
      {isLoading && (
        <div className="flex items-end pl-5">
          <Spinner size="sm" inline={true} />
        </div>
      )}
      {isError && (
        <div className="flex flex-col justify-end pl-3">
          <p>ERROR</p>
          <p className="text-xs">{responseMsg}</p>
        </div>
      )}
      {isSuccess && (
        <div className="flex flex-col justify-end pl-3">
          <p>Success</p>
          <p className="text-xs">{responseMsg}</p>
        </div>
      )}
    </div>
  );
};

export default AssingUsers;
