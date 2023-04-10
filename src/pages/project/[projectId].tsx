import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { Navbar, Sidebar } from "../../components";
import AnotherProjectBar from "../../components/ProjectBar";
import File from "../../components/TEST/File";
import { ManageProjectContext } from "../../contexts/manageProjectContext";
import ProjectPageProvider, {
    ProjectPageContext,
} from "../../contexts/projectPageContext";
import useOutsideAlerter from "../../hooks/useComponentVisible";
import { api } from "../../utils/api";
import { appRouter } from "../../server/api/root";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { createTRPCContext } from "../../server/api/trpc";
import superjson from "superjson";
import { InferGetServerSidePropsType } from "next";


import {

    createDefaultMapFromNodeModules,
} from "@typescript/vfs";
import ts from "typescript";

const FilePage = (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    const { fsMapString } = props;

    const [currentFileId, setCurrentFileId] = useState("");
    const [code, setCode] = useState<string>("");
    const router = useRouter();
    const projectId = router.query?.projectId as string;
    const fileId = currentFileId;

    const { setAddUserMenuOpen } = useContext(ProjectPageContext);
    const { getOneProject } = useContext(ManageProjectContext);

    const { data: singleProjectData, isSuccess } = getOneProject(projectId);

    const handleFileIdChange = (id: string) => {
        setCurrentFileId(id);
    };
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, setAddUserMenuOpen);

    const { mutate: saveFile } = api.file.saveFile.useMutation();

    const {
        mutate: runCode,
        data: runCodeResult,
        reset,
    } = api.compiler.writeFileAndRun.useMutation();

    //we check if we can access this project

    useEffect(() => {
        if (singleProjectData?.status === "failed") {
            router.push("/home");
        }
    }, [singleProjectData?.status]);

    if (singleProjectData?.status === "success") {
        singleProjectData?.data.files.map((el) => {
            if (el.id === fileId) {
                el.content = code;
            }
            return el;
        });
    }

    const handleRunCode = () => {
        if (singleProjectData?.data.files) {
            runCode({ files: singleProjectData?.data.files, current: code });
        }
    };
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
            <div className="scrollbar-hide flex  h-[calc(100vh)] w-screen overflow-x-scroll bg-gray-200 ">
                <div className="flex flex-col">
                    <Navbar handleSaveFile={handleSubmit} handleRunCode={handleRunCode} />
                    <div className="flex h-[calc(100vh_-_var(--navbar-h))]">
                        <Sidebar
                            isProjectFetched={isSuccess}
                            project={singleProjectData?.data}
                        />
                        <div className="flex flex-col">
                            <AnotherProjectBar
                                projectTitle={singleProjectData?.data.title}
                                isHomePage={false}
                                projectId={projectId}
                            >
                                <File
                                    onFileChange={handleFileIdChange}
                                    setCode={setCode}
                                    code={code}
                                    reset={reset}
                                    runCodeResult={runCodeResult}
                                    fsMap={fsMapString}
                                />
                            </AnotherProjectBar>
                        </div>
                    </div>
                </div>
            </div>
        </ProjectPageProvider>
    );
};
export const getServerSideProps = async (ctx) => {
    const ssg = createProxySSGHelpers({
        router: appRouter,
        ctx: await createTRPCContext({
            req: ctx.req,
            res: ctx.res,
            user: ctx.user,
        }), // replace with your own context,
        transformer: superjson,
    });
    const id = ctx.params.projectId as string;
    await ssg.project.getProjectQuery.prefetch({ id });
    const user = await ssg.user.getMe.fetch();

    const fsMap = createDefaultMapFromNodeModules({
        target: ts.ScriptTarget.ES2015,
    });
    console.time("SERVER MAP");
    const fsMapString = JSON.stringify(Array.from(fsMap.entries()));
    console.timeEnd("SERVER MAP");


    return {
        props: {
            trpcState: ssg.dehydrate(),
            id,
            fsMapString,
        },
    };
};
export default FilePage;
