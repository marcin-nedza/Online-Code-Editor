import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { useState } from "react";
import { api } from "../../utils/api";

export function useSaveProject(projectId: string|string[]) {
  const [showElement, setShowElement] = useState(false);
  const { mutate: save, isLoading } = api.project.updateProject.useMutation();

  const handleSave = (text: string) => {
    save({ id: projectId, content: text });
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
