import { EditorState } from "@codemirror/state";
import { EditorView,Tooltip,showTooltip } from "@codemirror/view";
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

import {StateField,Transaction} from "@codemirror/state"

let socket: Socket;

const cursorTooltipField = StateField.define<readonly Tooltip[]>({
  create:state=> getCursorTooltips(state,-1),

  update(tooltips, tr) {
      
        console.log('99999',tr)
    if (!tr.docChanged && !tr.selection) return tooltips
        console.log('ATU')
    const pos = tr.changes.length ? tr.changes.mapPos(tooltips[0].pos) : tooltips[0].pos // adjust position for changes in the document
    return getCursorTooltips(tr.state,pos)
  },

  provide: f => showTooltip.computeN([f], state => state.field(f))
})

function getCursorTooltips(state: EditorState,position:number): readonly Tooltip[] {
     
  return state.selection.ranges
    .filter(range => range.empty)
    .map(range => {
      let line = state.doc.lineAt(range.head)
      let text ='dupa' 
      return {
        pos:0,
        above: true,
        strictSide: true,
        arrow: true,
        create: () => {
          let dom = document.createElement("div")
          dom.className = "cm-tooltip-cursor"
          dom.textContent = text
          return {dom}
        }
      }
    })
}
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
                let pos=v.state.selection.main.head
                socket.emit('POSITION',{pos,projectId})
        if (v.docChanged) {
          const data = {
                        line:v.state.selection.main.head,
            len: view.state.doc.length,
            text: view.state.doc.toString(),
            projectId,
          };
          setCode(v.state.doc.toString());
          socket.emit(ROOM_ACTION.CODE_CHANGED, data);
        }
      }),
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

        socket.on("SENDPOS",(data)=>{
            view.dispatch({
                
            })
            console.log('SOCKET POS',data)
        })
    if (!view) return;
    if (router.isReady && projectId) {
      connectToRoom(socket, projectId);
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
// function getCursorTooltips(state) {
//   return state.selection.ranges
//     .filter(range => range.empty)
//     .map(range => {
//       let line = state.doc.lineAt(range.head);
//       let text = line.number + ":" + (range.head - line.from);
//
//       // Listen for a socket.io event that provides the tooltip position data.
//       socket.on("tooltip", data => {
//         // Create a tooltip at the specified position.
//         showTooltip(state, { pos: data.pos, above: true, create: () => {
//           let dom = document.createElement("div");
//           dom.className = "cm-tooltip-cursor";
//           dom.textContent = data.text;
//           return {dom};
//         }});
//       });
//
//       return {
//         pos: range.head,
//         above: true,
//         strictSide: true,
//         arrow: true,
//         create: () => {
//           let dom = document.createElement("div");
//           dom.className = "cm-tooltip-cursor";
//           dom.textContent = text;
//           return {dom};
//         }
//       };
//     });
// }
