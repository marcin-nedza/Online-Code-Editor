import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { api } from "../../utils/api";
import Editor from "../Editor";
import Spinner from "../Spinner";
import { io, Socket } from "socket.io-client";
import { connectToRoom } from "../../lib/socket/socketControllers";
import Terminal from "../Terminal";
import { ProjectPageContext } from "../../contexts/projectPageContext";

let socket: Socket;

type Props = {
  onFileChange: (id: string) => Dispatch<SetStateAction<string>>;
  setCode: Dispatch<SetStateAction<string>>;
  code: string;
    runCodeResult:string
};
const File = ({ code, runCodeResult,onFileChange, setCode }: Props) => {

  const { tabId } = useContext(ProjectPageContext);
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
      setCode(val.data.content);
    },
  });

  const {  reset } =
    api.compiler.writeFileAndRun.useMutation();
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
    getFile({ id: fileId });
  }, [fileId]);

  return (
    <div className="">
      <div className="flex bg-gray-200">
        <div className="relative min-h-[calc(100vh_-_(var(--navbar-h)_+_var(--sidebar-title-h)_+_var(--terminal-h)_+_var(--pathbar-h))_-_1px)] w-full bg-[#282c34]">
          {isFileLoading && <Spinner />}
          {isLoading && <Spinner />}
          {isSuccess && (
            <Editor
              fileId={fileId}
              code={code}
              setCode={setCode}
              socket={socket}
            />
          )}
        </div>
      </div>

      <Terminal output={runCodeResult ?? ""} />
    </div>
  );
};

export default File;
