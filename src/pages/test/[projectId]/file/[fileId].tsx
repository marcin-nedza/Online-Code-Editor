import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  Editor,
  Navbar,
  Sidebar,
  Spinner,
  Terminal,
} from "../../../../components";
import ProjectBar from "../../../../components/ProjectBar";
import ProjectPageProvider, {
  ProjectPageContext,
} from "../../../../contexts/projectPageContext";
import useOutsideAlerter from "../../../../hooks/useComponentVisible";
import { connectToRoom } from "../../../../lib/socket/socketControllers";
import {SimpleFile} from "../../../../schemas/file";
import { api } from "../../../../utils/api";

let socket: Socket;
const FilePage = () => {
  const router = useRouter();
  const { setAddUserMenuOpen } = useContext(ProjectPageContext);
  const [code, setCode] = useState<string>("");
  const projectId = router.query?.projectId as string;
  const fileId = router.query?.fileId as string;
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setAddUserMenuOpen);

  const { mutate: getProject, data: singleProjectData } =
    api.project.getSingleProject.useMutation();

  const { mutate: saveFile, isLoading } = api.file.saveFile.useMutation();
  const {
    mutate: runCode,
    data: runCodeResult,
    reset,
  } = api.compiler.writeFileAndRun.useMutation();
  const {
    data: singleFileData,
    mutate: getFile,
    isLoading: isFileLoading,
    isSuccess,
  } = api.file.getSingleFile.useMutation({
    onSuccess: (val) => {
      setCode(val.data.content);
    },
  });

  singleProjectData?.data.files.map((el) => {
    if (el.id === fileId) {
      el.content = code;
    }
    return el;
  });

  const handleRunCode = () => {
    if (singleProjectData?.data.files && isSuccess) {
            console.log("ASDASDASDASD",singleProjectData?.data.files)
      runCode({ files: singleProjectData?.data.files, current: code });
    }
  };
  //when redirected to diffrent project, reset terminal output
  //then fetch current project
  useEffect(() => {
    reset();
    if (projectId) {
      getFile({ id: fileId });
      getProject({ id: projectId });
    }
  }, [projectId, fileId]);

  const handleSubmit = () => {
    try {
      if (projectId) {
        saveFile({ id: fileId, content: code });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetch("/api/socket")
      .then(() => {
        const userId = localStorage.getItem("id");
        socket = io();
        connectToRoom({ socket, fileId, userId });
      })
      .catch((err) => console.log(err));
  }, [projectId]);

  if (isFileLoading) {
    return <Spinner />;
  }

const tabArray:SimpleFile[]=[]
    console.log('TAB',tabArray)
  return (
    <ProjectPageProvider>
      <div className="flex w-screen bg-gray-200">
        <div className="flex flex-col">
          <Navbar handleSaveFile={handleSubmit} handleRunCode={handleRunCode} />
          <div className="flex">
            <Sidebar files={tabArray}/>
            <div className="flex flex-col">
              <ProjectBar
                title={singleFileData?.data.title}
                files={tabArray}

              >
                <div className="flex bg-gray-200">
                  <div className="relative w-full">
                    {isLoading && <Spinner />}
                    {isSuccess && (
                      <Editor code={code} setCode={setCode} socket={socket} />
                    )}
                  </div>
                </div>
              </ProjectBar>
              <Terminal output={runCodeResult ?? ""} />
            </div>
          </div>
        </div>
      </div>
    </ProjectPageProvider>
  );
};

export default FilePage;
