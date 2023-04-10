import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ProjectPageContext } from "../../contexts/projectPageContext";
import { connectToRoom } from "../../lib/socket/socketControllers";
import { api } from "../../utils/api";
import dynamic from "next/dynamic";
import { Editor } from "../Editor";
// import Spinner from "../Spinner";
import Terminal from "../Terminal";

let socket: Socket;

const Spinner = dynamic(() => import("../Spinner"), { ssr: false });
const CodeEditor = dynamic(
    () => import("../Editor").then((module) => module.Editor),
    { ssr: false }
);

type Props = {
    onFileChange: (id: string) => void;
    setCode: Dispatch<SetStateAction<string>>;
    code: string;
    reset: () => void;
    runCodeResult: string | undefined;
    fsMap: string;
};

const File = ({
    code,
    fsMap,
    reset,
    runCodeResult,
    onFileChange,
    setCode,
}: Props) => {
    const { tabId, isAddUserOpen, isEmpty } = useContext(ProjectPageContext);
    const fileId = tabId;
    useEffect(() => {
        onFileChange(tabId);
    }, [tabId]);
    const { isLoading } = api.file.saveFile.useMutation();

    const {
        mutate: getFile,
        isLoading: isFileLoading,
        isSuccess,
    } = api.file.getSingleFile.useMutation({
        onSuccess: (val) => {
            console.log("HOLA");
            setCode(val.data.content);
        },
    });

    useEffect(() => {
        fetch("/api/socket")
            .then(() => {
                const userId = localStorage.getItem("id");
                socket = io();
                connectToRoom({ socket, fileId, userId });
            })
            .catch((err) => console.log(err));
    }, [fileId]);

    useEffect(() => {
        reset();
        if (fileId && !isAddUserOpen) {
            getFile({ id: fileId });
        }
    }, [fileId]);
const [isMounted,setIsMounted]=useState(false)
    return (
        <div className="">
            <div className="flex bg-gray-200">
                <div className="relative min-h-[calc(100vh_-_(var(--navbar-h)_+_var(--sidebar-title-h)_+_var(--terminal-h)_+_var(--sidebar-title-h))_-_1px)] w-full bg-[#282c34]">
                    {isFileLoading && <Spinner />}
                    {isLoading && <Spinner />}
                    {isSuccess && !isEmpty && (
                        <CodeEditor
                            fileId={fileId}
                            code={code}
                            setCode={setCode}
                            socket={socket}
                            fsMap={fsMap}
                            mounted={isMounted}
                            setMounted={setIsMounted}
                        />
                    )}
                </div>
            </div>

            <Terminal output={runCodeResult ?? ""} />
        </div>
    );
};

export default File;
