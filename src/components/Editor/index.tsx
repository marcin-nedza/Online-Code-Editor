import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { ROOM_ACTION } from "../../constants/events";
import {
    connectToRoom,
    updateContentEmitter,
    userConnectedListener
} from "../../lib/socket/socketControllers";
import { TViewState } from "../../schemas/socket";
import Spinner from "../Spinner";
import { basicExtensions } from "./basicExtensions";
import { useSaveProject } from "./keyBindings";

let socket: Socket;

const Editor = ({
  code,
  setCode,
}: {
  code: string;
  setCode: (val: string) => void;
}) => {
  const editor = useRef<HTMLInputElement>();
  const router = useRouter();
  const  projectId  = router.query?.projectId ?? ''

  const { myKeymap, showElement, setShowElement, isLoading } =
    useSaveProject(projectId);

  useEffect(() => {
    fetch("/api/socket");
    socket = io();
    const extensions = [
      basicExtensions,
      myKeymap,
      EditorView.updateListener.of((v) => {
        if (v.docChanged) {
          const data = {
            len: view.state.doc.length,
            text: view.state.doc.toString(),
            projectId,
          };
          setCode(v.state.doc.toString());
          socket.emit(ROOM_ACTION.CODE_CHANGED, data);
        }
      }),
    ];

    const startState = EditorState.create({
      extensions: extensions,
      doc: code,
    });
    const view = new EditorView({
      state: startState,
      parent: editor.current,
    });

    if (!view) return;
    if (router.isReady && projectId) {
      connectToRoom(socket, projectId);
      const update = (updatedData: TViewState) => {
        view.setState(
          EditorState.create({ doc: updatedData.text, extensions: extensions })
        );
      };
      userConnectedListener(socket);

      updateContentEmitter(socket, update);
    }
    return () => {
      view.destroy();
    };
  }, [projectId, router.isReady]);

    //function to show Save component for 3500ms
  useEffect(() => {
    setTimeout(() => {
      setShowElement(false);
    }, 3500);
  }, [showElement]);

  return (
    <>
      {/*@ts-expect-error asdad */}
      <div ref={editor}></div>
      {isLoading && <Spinner />}
      {showElement && !isLoading && (
        <div className="absolute p-2 text-white top-1/2 left-1/2 -translate-x-12 -translate-y-6 bg-accent">
          Saved
        </div>
      )}
    </>
  );
};

export default Editor;
