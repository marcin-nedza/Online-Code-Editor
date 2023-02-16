import { defaultKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ROOM_ACTION } from "../../constants/events";
import {
  connectToRoom,
  updateContentEmitter,
  userConnectedListener,
} from "../../lib/socket/socketControllers";
import { TViewState } from "../../schemas/socket";
import { api } from "../../utils/api";
import Spinner from "../Spinner";
import { extensions as basicExtensions } from "./config";
import { solarizedDark } from "./darkstyle";
let socket: Socket;

const Editor = ({
  code,
  setCode,
}: {
  code: string;
  setCode: (val: string) => void;
}) => {
  const [showElement, setShowElement] = useState(false);
  const [first, setFirst] = useState("");
  const editor = useRef<HTMLInputElement>();
  const router = useRouter();
  const { projectId } = router.query;

  //TODO:move to socket config
  const onUpdate = EditorView.updateListener.of((v) => {
    setCode(v.state.doc.toString());
    console.log("AAAA");
  });

  const {
    mutate: save,
    isLoading,
    isSuccess,
  } = api.project.updateProject.useMutation();

  const handleSave = (text: string) => {
    save({ id: projectId, content: text });
  };

  //keybinding ctrl +s to save content of project
  const myKeymap = keymap.of([
    {
      key: "Mod-s",

      run: (state: EditorView) => {
        handleSave(state.state.doc.toString());
        setShowElement(true);
        return true;
      },
    },
  ]);
  useEffect(() => {
    fetch("/api/socket");
    socket = io();

    const extensions = [
keymap.of(defaultKeymap),
  basicSetup,
  javascript({
    jsx: true,
    typescript: true,
  }),
  lineNumbers(),
  solarizedDark,

      onUpdate,
      myKeymap,
      EditorView.updateListener.of((v) => {
        if (v.docChanged) {
          const data = {
            len: view.state.doc.length,
            text: view.state.doc.toString(),
            projectId,
          };
          console.log("changed");
          socket.emit(ROOM_ACTION.CODE_CHANGED, data);
        }
      }),
    ];
    const startState = EditorState.create({
      extensions: extensions,
            doc:code
    });
    const view = new EditorView({
      state: startState,
      parent: editor.current,
    });

    if (!view) return;
    if (router.isReady) {
      if (projectId) {
        connectToRoom(socket, projectId);
      }
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
