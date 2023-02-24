import { defaultKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { solarizedDark } from "./darkstyle";

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
const basicExtensions = [
  keymap.of(defaultKeymap),
  basicSetup,
  javascript({
    jsx: true,
    typescript: true,
  }),
  lineNumbers(),
  solarizedDark,
  cursorTooltipBaseTheme
];
const TooltipDisplay =({pos,displayed,arrow,text}:{pos:number,text:string,displayed:boolean,arrow:boolean})=>{
    return {

          pos,
          above:true,
          strictSide: true,
          arrow,
          create: () => {
            let dom = document.createElement("div");
            dom.className =displayed? "cm-tooltip-cursor":''
            dom.textContent =displayed? text: ''
            return {
              dom,
            };
          },
    }
}
export { basicExtensions, cursorTooltipBaseTheme ,TooltipDisplay};
