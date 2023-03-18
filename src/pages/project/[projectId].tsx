import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { Navbar, Sidebar } from "../../components";
import AnotherProjectBar from "../../components/ProjectBar";
import File from "../../components/TEST/File";
import ProjectPageProvider, {
  ProjectPageContext,
} from "../../contexts/projectPageContext";
import useOutsideAlerter from "../../hooks/useComponentVisible";
import { api } from "../../utils/api";

const FilePage = () => {
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

  const {
    mutate: getProject,
    data: singleProjectData,
    isSuccess,

  } = api.project.getSingleProject.useMutation();
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
    const fetchProject=()=>{
        getProject({id:projectId})
    }
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
      // getProject({ id: projectId });
        fetchProject()
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
      <div className="flex w-screen  overflow-x-scroll bg-gray-200 scrollbar-hide h-[calc(100vh)] ">
        <div className="flex flex-col">
          <Navbar handleSaveFile={handleSubmit} handleRunCode={handleRunCode} />
          <div className="flex h-[calc(100vh_-_var(--navbar-h))]">
            <Sidebar
              isProjectFetched={isSuccess}
              project={singleProjectData?.data}
            />
            <div className="flex flex-col">

              <AnotherProjectBar
                setCode={setCode}
                projectTitle={singleProjectData?.data.title}
                isHomePage={false}
                project={singleProjectData?.data}
                                fetchProject={fetchProject}
              >
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
