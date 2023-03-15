import { defaultKeymap } from "@codemirror/commands";
import { autocompletion } from "@codemirror/autocomplete";
import { javascript } from "@codemirror/lang-javascript";
import { Tooltip, keymap, lineNumbers, EditorView,showTooltip } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { solarizedDark } from "./darkstyle";
import {
  EditorState,
  StateField,
} from "@codemirror/state";

const cursorTooltipBaseTheme = EditorView.theme({
  ".cm-tooltip.cm-tooltip-cursor": {
    backgroundColor: "#66b",
    color: "red",
    border: "none",
    padding: "2px 7px",
    borderRadius: "8px",
    "& .cm-tooltip-arrow:before": {
      borderTopColor: "#66b",
    },
    "& .cm-tooltip-arrow:after": {
      borderTopColor: "transparent",
    },
  },
});
const cursorTooltipHidden = EditorView.theme({
  ".cm-tooltip.cm-tooltip-cursor": {
    display: "none",
    backgroundColor: "white",
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
const basicExtensions = [
  keymap.of(defaultKeymap),
  basicSetup,
  autocompletion({}),
  javascript({
    jsx: true,
    typescript: true,
  }),
  lineNumbers(),
  solarizedDark,
];
const TooltipDisplay = ({
  pos,
  displayed,
  arrow,
  text,
}: {
  pos: number;
  text: string;
  displayed: boolean;
  arrow: boolean;
}) => {
  return {
    pos,
    above: true,
    strictSide: true,
    arrow,

    create: () => {
      let dom = document.createElement("div");
      dom.className = displayed ? "cm-tooltip-cursor" : "";
      dom.textContent = displayed ? text : "";
      return {
        dom,
      };
    },
  };
};
const cursorTooltipField = (position: number,name:string) => {
  return StateField.define<readonly Tooltip[]>({
    // create: getCursorTooltips,
    create(view) {
      return getCursorTooltips({state:view,position,name});
    },

    update(tooltips, tr) {
      if (!tr.docChanged && !tr.selection) return tooltips;
      const updated = getCursorTooltips({state:tr.state,position,name});

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
};
// state: EditorState,position:number
function getCursorTooltips({
  state,
  position,
  name,
}: {
  state: EditorState;
  position: number;
  name: string;
}): readonly Tooltip[] {
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
export {
  basicExtensions,
  cursorTooltipHidden,
  cursorTooltipBaseTheme,
  cursorTooltipField,
};
