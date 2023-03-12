import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import {
    Navbar,
    Sidebar,
} from "../../components";
import AnotherProjectBar from "../../components/ProjectBar/AnotherProjectBar";
import File from "../../components/TEST/File";
import ProjectPageProvider, {
    ProjectPageContext
} from "../../contexts/projectPageContext";
import useOutsideAlerter from "../../hooks/useComponentVisible";
import { api } from "../../utils/api";

const FilePage = () => {
  const { data, isSuccess } = api.project.getAllProject.useQuery();
  const [currentFileId, setCurrentFileId] = useState("");
  const [code, setCode] = useState<string>("");
  const router = useRouter();
  const { setAddUserMenuOpen } = useContext(ProjectPageContext);

  const projectId = router.query?.projectId as string;
  const fileId = currentFileId;

  const handleFileIdChange = (id: string) => {
    setCurrentFileId(id);
  };
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setAddUserMenuOpen);

  const { mutate: getProject, data: singleProjectData } =
    api.project.getSingleProject.useMutation();
  const { mutate: saveFile } = api.file.saveFile.useMutation();

  const {
    mutate: runCode,
    data: runCodeResult,
    reset,
  } = api.compiler.writeFileAndRun.useMutation();

  singleProjectData?.data.files.map((el) => {
    if (el.id === fileId) {
      el.content = code;
    }
    return el;
  });
  const handleRunCode = () => {
    if (singleProjectData?.data.files) {
      runCode({ files: singleProjectData?.data.files, current: code });
    }
  };
  //when redirected to diffrent project, reset terminal output
  //then fetch current project
  useEffect(() => {
    reset();
    if (projectId) {
      getProject({ id: projectId });
    }
  }, [projectId]);

  const handleSubmit = () => {
    try {
      if (projectId) {
        saveFile({ id: fileId, content: code });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ProjectPageProvider>
      <div className="flex w-screen bg-gray-200">
        <div className="flex flex-col">
          <Navbar handleSaveFile={handleSubmit} handleRunCode={handleRunCode} />
          <div className="flex">
            <Sidebar isProjectFetched={isSuccess} listOfProjects={data?.data}/>
            <div className="flex flex-col">
              <AnotherProjectBar projectTitle={singleProjectData?.data.title}>
                <File
                  onFileChange={handleFileIdChange}
                  setCode={setCode}
                  code={code}
                  reset={reset}
                  runCodeResult={runCodeResult}
                />
              </AnotherProjectBar>
            </div>
          </div>
        </div>
      </div>
    </ProjectPageProvider>
  );
};

export default FilePage;
