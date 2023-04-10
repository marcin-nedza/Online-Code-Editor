import {
    Compartment,
    Extension,
    EditorState,
    StateField,
} from "@codemirror/state";

import { autocompletion, completeFromList } from '@codemirror/autocomplete';
import { EditorView } from "@codemirror/view";
import {
    createSystem,
    createVirtualTypeScriptEnvironment,
    VirtualTypeScriptEnvironment,
} from "@typescript/vfs";
import ts from "typescript";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { ROOM_ACTION } from "../../constants/events";
import {
    getPositionListener,
    updateContentEmitter,
} from "../../lib/socket/socketControllers";
import { TViewState } from "../../schemas/socket";
import Spinner from "../Spinner";
import {
    basicExtensions,
    cursorTooltipBaseTheme,
    cursorTooltipField,
    cursorTooltipHidden,
} from "./basicExtensions";
import { useSaveFile } from "./keyBindings";
import { createLinter } from "./lint";
import lzstring from "lz-string";

export const Editor = ({
    code,
    setCode,
    socket,
    fileId,
    fsMap,
    mounted,
    setMounted
}: {
    code: string;
    setCode: (val: string) => void;
    socket: Socket;
    fileId: string;
    fsMap: string;
    mounted:boolean
    setMounted:()=>void
}) => {
    useEffect(()=>{
            console.log('mounted')
            },[])
//map for typescript language
console.time('TIME')
    let fsMapDefault = new Map();
    if (fsMap) {
        fsMapDefault = new Map(JSON.parse(fsMap));
    }
console.timeEnd('TIME')
    console.log('yo-------------------',mounted)

    const editor = useRef<HTMLInputElement>();
    const router = useRouter();
    const projectId = router.query?.projectId ?? "";
    const userId = localStorage.getItem("id");
    const [position, setPosition] = useState(0);
    const [name, setName] = useState("");
    const { myKeymap, showElement, setShowElement, isLoading } =
        useSaveFile(fileId);
    let theme = new Compartment();
    const compilerOptions: ts.CompilerOptions = {
        target: ts.ScriptTarget.ES2016,
        esModuleInterop: true,
    };
     const tsEnvStateField = StateField.define<VirtualTypeScriptEnvironment>({
        create(state: EditorState) {
        console.time('FSMAP')
            const fsMap2 = new Map(fsMapDefault);
            fsMap2.set("index.ts", state.sliceDoc() || " ");
            const system = createSystem(fsMap2);

        console.timeEnd('FSMAP')
            return createVirtualTypeScriptEnvironment(
                system,
                [...fsMap2.keys()],
                ts,
                compilerOptions
            );
        },
        update(env, tr) {
            if (tr.docChanged) {
                // Typescript removes files from fsMap when empty, but index.ts is
                // looked up without checking for existence in other places. Tell
                // typescript that an empty file has a space in it to prevent this
                // empty-remove behavior from happening.
                const contents = tr.newDoc.sliceString(0) || " ";
                env.updateFile("index.ts", contents);
            }
            return env;
        },
    });
 function createAutocompletion(): Extension {
  return autocompletion({
    override: [
      (ctx) => {
        const { pos, state } = ctx;
        const tsEnv = state.field(tsEnvStateField);

        const completions = tsEnv.languageService.getCompletionsAtPosition(
          'index.ts',
          pos,
          {},
        );

        if (!completions) {
          return null;
        }

        return completeFromList(
          completions.entries.map((c) => ({
            type: c.kind,
            label: c.name,
          })),
        )(ctx);
      },
    ],
  });
  
}

    useEffect(() => {
        const extensions = [
            basicExtensions,
            tsEnvStateField,
           createAutocompletion(), 
           createLinter(tsEnvStateField),
            myKeymap,
            theme.of(cursorTooltipHidden),

            EditorView.updateListener.of((v) => {
                const pos = v.state.selection.main.head;
                if (v.view.hasFocus) {
                    socket.emit("POSITION", {
                        pos,
                        fileId,
                        userId,
                        username: localStorage.getItem("username"),
                    });
                }
                if (v.docChanged) {
                    const data = {
                        line: v.state.selection.main.head,
                        len: view.state.doc.length,
                        text: view.state.doc.toString(),
                        fileId,
                    };
                    setCode(v.state.doc.toString());
                    socket.emit(ROOM_ACTION.CODE_CHANGED, data);
                }
            }),

            cursorTooltipField(position, name),
        ];

        const startState = EditorState.create({
            extensions: extensions,
            doc: code,
        });
        const view = new EditorView({
            state: startState,
            parent: editor.current,
        });

        if (name.length > 0) {
            view.dispatch({
                effects: theme.reconfigure(cursorTooltipBaseTheme),
            });
        }
        if (!view) return;
        if (router.isReady && projectId && userId) {
            getPositionListener({
                socket,
                setNameCb: setName,
                setPositionCb: setPosition,
            });
            const update = (updatedData: TViewState) => {
                setCode(updatedData.text);
                view.setState(
                    EditorState.create({ doc: updatedData.text, extensions: extensions })
                );
            };

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
            <div className="" ref={editor}></div>
            {isLoading  && <Spinner />}
            {showElement && !isLoading && (
                <div className="absolute top-1/2 left-1/2 -translate-x-12 -translate-y-6 bg-accent p-2 text-white">
                    Saved
                </div>
            )}
        </>
    );
};

// export default Editor;
