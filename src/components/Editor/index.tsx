import { EditorState, StateField, Compartment } from "@codemirror/state";
import { EditorView, showTooltip, Tooltip } from "@codemirror/view";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ROOM_ACTION } from "../../constants/events";
import { ProjectPageContext } from "../../contexts/projectPageContext";
import {
  connectToRoom,
  updateContentEmitter,
  userConnectedListener,
} from "../../lib/socket/socketControllers";
import { TViewState } from "../../schemas/socket";
import Spinner from "../Spinner";
import {
  basicExtensions,
  cursorTooltipBaseThemeHidden,
  cursorTooltipBaseTheme,
  TooltipDisplay,
} from "./basicExtensions";
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
  const projectId = router.query?.projectId ?? "";
  const userId = localStorage.getItem("id");
  const [position, setPosition] = useState(0);
  const [name, setName] = useState("");
  const [viewTooltip, setViewTooltip] = useState(false);
  const { myKeymap, showElement, setShowElement, isLoading } =
    useSaveProject(projectId);
  console.log("POSITION", position);

  const cursorTooltipField = StateField.define<readonly Tooltip[]>({
    // create: getCursorTooltips,
    create(view) {
      return getCursorTooltips(view);
    },

    update(tooltips, tr) {
      if (!tr.docChanged && !tr.selection) return tooltips;
      const updated = getCursorTooltips(tr.state);

      updated.forEach((tooltip) => {
        tooltip.pos = position;
        return;
      });
      return updated;
    },

    provide: (f) =>
      showTooltip.computeN([f], (state) => {
        return state.field(f);
      }),
  });
  function getCursorTooltips(state: EditorState): readonly Tooltip[] {
    return state.selection.ranges
      .filter((range) => range.empty)
      .map((range) => {
        let line = state.doc.lineAt(range.head);
        let text = name;
        return TooltipDisplay({
          pos: position,
          arrow: true,
          displayed: true,
          text,
        });
      });
  }
  //TODO: keep track of users position on server
  const cursorTooltipBaseTheme = EditorView.baseTheme({
    ".cm-tooltip.cm-tooltip-cursor": {
      backgroundColor: "#66b",
      color: "white",
      border: "none",
      padding: "2px 7px",
      borderRadius: "4px",
      "& .cm-tooltip-arrow:before": {
        borderTopColor: "#66b",
      },
      "& .cm-tooltip-arrow:after": {
        borderTopColor: "transparent",
      },
    },
  });
  let theme = new Compartment();
  function changeTheme(view: EditorView, bastheme) {
    view.dispatch({
      effects: theme.reconfigure(bastheme),
    });
  }

  useEffect(() => {
    fetch("/api/socket");
    socket = io();

    const extensions = [
      basicExtensions,
      myKeymap,
      theme.of(cursorTooltipBaseTheme),
      EditorView.updateListener.of((v) => {
        const pos = v.state.selection.main.head;
        if (v.view.hasFocus) {
          socket.emit("POSITION", {
            pos,
            projectId,
            userId,
            username: localStorage.getItem("username"),
          });
        }

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
      cursorTooltipField,
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
    if (router.isReady && projectId && userId) {
      console.log("projectid", projectId);
      connectToRoom({ socket, projectId, userId });
      socket.on("SENDPOS", (data) => {
        if (data.userId != userId) {
          setPosition(data.pos);
          setName(data.username);
        }
      });
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
  }, [projectId, router.isReady, position]);

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
