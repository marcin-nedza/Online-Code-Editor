import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Editor from "../../components/Editor";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Spinner from "../../components/Spinner";
import Terminal from "../../components/Terminal";
import { api } from "../../utils/api";

const ProjectPage = () => {
  const router = useRouter();
  const [code, setCode] = useState<string>("");
  const { projectId } = router.query;
  const {
    mutate: updateProject,
    data: updatedProject,
    isLoading,
  } = api.project.updateProject.useMutation();
  const {
    mutate: runCode,
    data: compilerData,
    reset,
  } = api.compiler.runCode.useMutation();
  const {
    mutate,
    mutateAsync,
    data,
    isLoading: isProjectLoading,
    isSuccess,
  } = api.project.getSingleProject.useMutation({
    onSuccess: (val) => {
      setCode(val.data.content ?? "");
    },
  });
  const handleRunCode = () => {
    runCode({ content: code });
  };

  //when redirected to diffrent project, reset terminal output
  //then fetch current project
  useEffect(() => {
    reset();
    if (projectId) {
      mutate({ id: projectId as string });
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
  if (isProjectLoading) {
    return <Spinner />;
  }
  return (
    <div className="flex w-screen bg-gray-200">
      <div className="flex flex-col">
        <Navbar handleSaveFile={handleSubmit} handleRunCode={handleRunCode} />
        <div className="flex">
          <Sidebar />
          <div className="flex flex-col">
            <div className="flex bg-gray-200">
              <div className="relative w-full">
                <div
                // className="h-[var(--sidebar-title-h)]
                // w-[calc(100vw_-_var(--sidebar-w))]
                // bg-main-bg
                // py-2"
                >
                  <div className="flex h-[var(--sidebar-title-h)]  w-[856px] items-center bg-main-bg text-xs text-white">
                    <p>title &nbsp; </p>
                    <p className="text-green-400"> &gt; </p>
                    <p className="">&nbsp; {data?.data.title}</p>{" "}
                  </div>
                </div>
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
