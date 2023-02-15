import { defaultKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ROOM_ACTION } from "../../constants/events";
import {
  connectToRoom,
  updateContentEmitter,
  userConnectedListener,
} from "../../lib/socket/socketControllers";
import { TViewState } from "../../schemas/socket";
import { api } from "../../utils/api";
import { solarizedDark } from "./darkstyle";

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
  const { projectId } = router.query;
  const { data: userData, isSuccess: userDataSuccess } =
    api.user.getMe.useQuery();
  const username = userData?.data.user?.username;
  //TODO:move to socket config
  const onUpdate = EditorView.updateListener.of((v) => {
    setCode(v.state.doc.toString());
  });
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
      onUpdate,
      lineNumbers(),
      solarizedDark,
      // cursorTooltip()
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

    if (router.isReady) {
      view.dom.addEventListener("input", (e) => {
        const data = {
          len: view.state.doc.length,
          text: view.state.doc.toString(),
          projectId,
        };
        socket.emit(ROOM_ACTION.CODE_CHANGED, data);
        const curs = view.state.selection.main.head;
        const line = view.state.doc.lineAt(curs);
      });
      if (projectId) {
        connectToRoom(socket, projectId);
      }
      const update = (updatedData: TViewState) => {
        view.setState(
          EditorState.create({ doc: updatedData.text, extensions: extensions })
        );
      };
      updateContentEmitter(socket, update);
      userConnectedListener(socket);
    }
    return () => {
      view.destroy();
    };
  }, [projectId, router.isReady]);

  return (
    <>
      {/*@ts-expect-error asdad */}
      <div ref={editor}></div>
    </>
  );
};

export default Editor;
