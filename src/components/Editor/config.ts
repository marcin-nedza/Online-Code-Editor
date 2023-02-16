import { defaultKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { keymap, lineNumbers } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { solarizedDark } from "./darkstyle";

 const extensions = [
  keymap.of(defaultKeymap),
  basicSetup,
  javascript({
    jsx: true,
    typescript: true,
  }),
  lineNumbers(),
  solarizedDark,
];

export  {
    extensions
}
