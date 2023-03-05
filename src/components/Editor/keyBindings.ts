import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { useState } from "react";
import { api } from "../../utils/api";

export function useSaveFile(fileId: string|string[]) {
  const [showElement, setShowElement] = useState(false);
  const { mutate: save, isLoading } = api.file.saveFile.useMutation();

  const handleSave = (text: string) => {
    save({ id: fileId, content: text });
    setShowElement(true);
  };
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
  return { handleSave, isLoading, showElement, myKeymap, setShowElement };
}
