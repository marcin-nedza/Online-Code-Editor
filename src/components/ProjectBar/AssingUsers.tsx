import { useRouter } from "next/router";
import React, { useState } from "react";
import { api } from "../../utils/api";

const AssingUsers = () => {
  const router = useRouter();
  const projectId = router.query?.projectId as string;
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const { data, mutate, isError, reset } =
    api.project.assignUserToProject.useMutation();
  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      mutate(
        { email: email, projectId: projectId },
        {
          onError: (message) => {
            setErrorMsg(message.message);
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
        <p className="mb-2">Enter users email</p>

        <form onSubmit={handleSubmit} className="flex">
          <input
            onChange={(e) => {
              reset();
              setEmail(e.target.value);
            }}
            placeholder="email"
            className="px-2 outline-none bg-accent2 caret-white"
          />
        </form>
      </div>
      {isError && (
        <div className="flex flex-col justify-end pl-3">
          <p>ERROR</p>
          <p className="text-xs">{errorMsg}</p>
        </div>
      )}
    </div>
  );
};

export default AssingUsers;
