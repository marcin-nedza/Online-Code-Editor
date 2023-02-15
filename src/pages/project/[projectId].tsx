import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { io, Socket } from "socket.io-client";
import Editor from "../../components/Editor";
import Navbar from "../../components/Navbar";
import Spinner from "../../components/Spinner";
import Terminal from "../../components/Terminal";
import { NAV_HEIGHT, SIDEBAR_WIDTH } from "../../constants/css";
import { connectToRoomEmitter } from "../../lib/socket/clientController";
import { TUpdatedProject, updateProjectSchema } from "../../schemas/project";
import { api } from "../../utils/api";

let socket: Socket;

const ProjectPage = () => {
  const router = useRouter();
  const [code, setCode] = useState<string>("");
  const { projectId } = router.query;
  const {
    mutate: updateProject,
    data: updatedProject,
    isLoading,
  } = api.project.updateProject.useMutation();
  const { mutate: runCode, data: compilerData } =
    api.compiler.runCode.useMutation();
  const {
    mutate,
    data,
    isLoading: isProjectLoading,
    isSuccess,
  } = api.project.getSingleProject.useMutation({
    onSuccess: (val) => {
      setCode(val.data.content ?? "");
    },
  });
  console.log("code", compilerData);
  const handleRunCode = () => {
    runCode({ content: code });
  };

  useEffect(() => {
    if (projectId) {
      mutate({ id: projectId });
    }
  }, [projectId]);
  const handleSubmit = () => {
    try {
      if (projectId) {
        updateProject({ id: projectId, content: code });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex w-screen bg-gray-200">
      <div className="flex flex-col">
        <Navbar handleSaveFile={handleSubmit} handleRunCode={handleRunCode} />
        <div className="flex">
           <div className="w-[var(--sidebar-w)]  bg-green-100">
            <p className="">chat</p>
          </div> 
          <div className="flex-col">
            <div className="flex bg-gray-200">
              <div className="relative w-full">
                {isLoading && <Spinner />}
                {isSuccess && <Editor code={code} setCode={setCode} />}
              </div>
            </div>
            <Terminal output={compilerData ?? ""} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
