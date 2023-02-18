import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Editor, Navbar, Sidebar, Spinner, Terminal } from "../../components";
import ProjectBar from "../../components/ProjectBar";
import { useManageState } from "../../hooks/manageStates";
import useOutsideAlerter from "../../hooks/useComponentVisible";
import { api } from "../../utils/api";

const ProjectPage = () => {
    const router = useRouter();
    const { isAddUsersOpen, setAddUsersMenuOpen } = useManageState();
    const [code, setCode] = useState<string>("");
    const [utilityBarOpen, setUtilityBarOpen] = useState(false);
    const { projectId } = router.query;
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, setAddUsersMenuOpen);
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
                <Navbar
                    handleSaveFile={handleSubmit}
                    handleRunCode={handleRunCode}
                    isAddUsersOpen={isAddUsersOpen}
                    setAddUsersMenuOpen={setAddUsersMenuOpen}
                />
                <div className="flex">
                    <Sidebar />
                    <div className="flex flex-col">
                        <ProjectBar
                            title={data?.data.title}
                            isAddUserOpen={isAddUsersOpen}
                            setAddUsersMenuOpen={setAddUsersMenuOpen}
                            >

                        <div className="flex bg-gray-200">
                            <div className="relative w-full">
                                {isLoading && <Spinner />}
                                {isSuccess && <Editor code={code} setCode={setCode} />}
                            </div>
                        </div>
                        </ProjectBar>
                        <Terminal output={compilerData ?? ""} />
                    </div>
                    {utilityBarOpen && (
                        <div className="w-[var(--utilitybar-w)] bg-white">utilitybar</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectPage;
