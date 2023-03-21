import {
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
} from "react";
import { io, Socket } from "socket.io-client";
import { ProjectPageContext } from "../../contexts/projectPageContext";
import { connectToRoom } from "../../lib/socket/socketControllers";
import { api } from "../../utils/api";
import Editor from "../Editor";
import Spinner from "../Spinner";
import Terminal from "../Terminal";

let socket: Socket;

type Props = {
  onFileChange: (id: string) =>void 
  setCode: Dispatch<SetStateAction<string>>;
  code: string;
  reset: () => void;
  runCodeResult: string|undefined;
};
const File = ({ code, reset, runCodeResult, onFileChange, setCode }: Props) => {
  const { tabId,isAddUserOpen, isEmpty } = useContext(ProjectPageContext);
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
            console.log('HOLA')
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

  return (
    <div className="">
      <div className="flex bg-gray-200">
        <div className="relative min-h-[calc(100vh_-_(var(--navbar-h)_+_var(--sidebar-title-h)_+_var(--terminal-h)_+_var(--sidebar-title-h))_-_1px)] w-full bg-[#282c34]">
          {isFileLoading && <Spinner />}
          {isLoading && <Spinner />}
          {isSuccess && !isEmpty && (
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
