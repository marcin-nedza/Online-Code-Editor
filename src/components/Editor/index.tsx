import { EditorState } from "@codemirror/state";
import { EditorView,Tooltip,showTooltip } from "@codemirror/view";
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


const cursorTooltipField = StateField.define<readonly Tooltip[]>({
  create: state => getCursorTooltips(state, -1),
  update(tooltips, tr) {
    if (!tr.docChanged && !tr.selection) return tooltips;
    const pos = tr.changes.length ? tr.changes.mapPos(tooltips[0].pos) : tooltips[0].pos;
    return getCursorTooltips(tr.state, pos);
  },
  provide: f => showTooltip.computeN([f], state => state.field(f)),
});

function getCursorTooltips(state: EditorState, position: number): readonly Tooltip[] {
  return state.selection.ranges
    .filter(range => range.empty)
    .map(range => {
      let line = state.doc.lineAt(range.head)
      let text = 'dupa';
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
const blabla='BLABLA'
  const { myKeymap, showElement, setShowElement, isLoading } =
    useSaveProject(projectId);


const testCursorField = StateField.define<readonly Tooltip[]>({
    create:state=> {
            console.log('here')
           return  getTestToolips(state,position)
        },

    update(tooltips, tr) {
            console.log('TU')
        if (!tr.docChanged && !tr.selection) {

            console.log('TAM')
                return tooltips
            }
            console.log('SIAM')
        return getTestToolips(tr.state,position)
    },

    provide: f => showTooltip.computeN([f], state => state.field(f))
})
function getTestToolips(state: EditorState,position:number): readonly Tooltip[] {
        console.log('toooltip')
    return state.selection.ranges
        .filter(range => range.empty)
        .map(range => {
            let line = state.doc.lineAt(range.head)
            let text = 'TEST'
            
            return {
                pos: position,
                above: true,
                strictSide: true,
                arrow: true,
                create: () => {
                    let dom = document.createElement("div")
                    dom.className = "cm-tooltip-cursor"
                    dom.textContent = blabla
                    return {dom}
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
                        line:v.state.selection.main.head,
            len: view.state.doc.length,
            text: view.state.doc.toString(),
            projectId,
          };
          setCode(v.state.doc.toString());
          socket.emit(ROOM_ACTION.CODE_CHANGED, data);
        }
      }),
cursorTooltipField,
            EditorView.domEventHandlers({
      mousedown(event, view) {
          const position = view.posAtCoords({ x: event.clientX, y: event.clientY });
                    console.log('mouse',position)
          if (position) {
            const transaction = view.state.update({
    effects: cursorTooltipField.update({ position }),
            });
            view.dispatch(transaction);
          }
        },
            })
            // testCursorField
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
