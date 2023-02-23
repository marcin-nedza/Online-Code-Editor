import { defaultKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { solarizedDark } from "./darkstyle";

const basicExtensions = [
  keymap.of(defaultKeymap),
  basicSetup,
  javascript({
    jsx: true,
    typescript: true,
  }),
  lineNumbers(),
  solarizedDark,
];
const cursorTooltipBaseTheme = EditorView.baseTheme({
  ".cm-tooltip.cm-tooltip-cursor": {
    backgroundColor: "#66b",
    color: "white",
    border: "none",
    padding: "2px 7px",
    borderRadius: "4px",
    "& .cm-tooltip-arrow:before": {
      borderTopColor: "#66b"
    },
    "& .cm-tooltip-arrow:after": {
      borderTopColor: "transparent"
    }
  }
})
export { basicExtensions,cursorTooltipBaseTheme  };
