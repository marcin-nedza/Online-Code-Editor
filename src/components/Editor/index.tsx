import { EditorState } from "@codemirror/state";
import { EditorView, Tooltip, showTooltip } from "@codemirror/view";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
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
import {StateField,Transaction,StateEffect} from "@codemirror/state"
import {api} from "../../utils/api";


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
    const userId=localStorage.getItem('id')
    const [position, setPosition] = useState(0)
    console.log('STATE POS',position)

  const { myKeymap, showElement, setShowElement, isLoading } =
    useSaveProject(projectId);

const cursorTooltipField = StateField.define<readonly Tooltip[]>({
  create: getCursorTooltips,

  update(tooltips, tr) {
    if (!tr.docChanged && !tr.selection) return tooltips
    const updated = getCursorTooltips(tr.state)

    updated.forEach((tooltip, i) => {
      console.log('KRUAW', i)
      tooltip.pos = position
        return

    })
    return updated
  },

  provide: f => showTooltip.computeN([f], state => {
    console.log('TOOLTO', f)
    console.log('TOOLTO2', state.field)
    console.log('TOOLTO3', state.field(f))
    return state.field(f)
  })
})
function getCursorTooltips(state: EditorState): readonly Tooltip[] {

  return state.selection.ranges
    .filter(range => range.empty)
    .map(range => {
      let line = state.doc.lineAt(range.head)
      let text = 'dupa'
      return {
        pos: position,
        above: true,
        strictSide: true,
        arrow: true,
        create: () => {
          let dom = document.createElement("div")
          dom.className = "cm-tooltip-cursor"
          dom.textContent = text
          return { dom }
        }
      }
    })
}

  useEffect(() => {
    fetch("/api/socket");
    socket = io();
    const extensions = [
      basicExtensions,
      myKeymap,
      EditorView.updateListener.of((v) => {
                const pos=v.state.selection.main.head
                console.log('before emit')
                socket.emit('POSITION',{pos,projectId,userId})

        if (v.docChanged) {
          const data = {
            line: v.state.selection.main.head,
            len: view.state.doc.length,
            text: view.state.doc.toString(),
            projectId,
          };
          setCode(v.state.doc.toString());
          socket.emit(ROOM_ACTION.CODE_CHANGED, data);
        }
      }),
          
            // testCursorField
      cursorTooltipField
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
            socket.on("SENDPOS",(data)=>{
                if(data.userId!=userId){
                setPosition(data.pos)
                }
            })
      const update = (updatedData: TViewState) => {
        setCode(updatedData.text);
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
  }, [projectId, router.isReady,position]);

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
