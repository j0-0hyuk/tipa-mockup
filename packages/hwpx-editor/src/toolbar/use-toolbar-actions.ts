import { useCallback, useSyncExternalStore } from "react";
import { useEditor } from "../components/EditorProvider";

export interface ToolbarActions {
  loadFile: (file: File) => Promise<void>;
  loadBytes: (data: Uint8Array, filename: string) => Promise<void>;
  serialize: () => Uint8Array;
  undo: () => boolean;
  redo: () => boolean;
  canUndo: boolean;
  canRedo: boolean;
  editorReady: boolean;
}

export function useToolbarActions(): ToolbarActions {
  const { store, loadFile, loadBytes, editorRef, subscribeToEditorState, dispatcher } =
    useEditor();

  const serialize = useCallback(() => {
    dispatcher.flush();
    return store.serialize();
  }, [store, dispatcher]);

  const undo = useCallback(() => {
    const editor = editorRef.current;
    if (!editor || editor.history.undos.length === 0) return false;
    editor.undo();
    return true;
  }, [editorRef]);

  const redo = useCallback(() => {
    const editor = editorRef.current;
    if (!editor || editor.history.redos.length === 0) return false;
    editor.redo();
    return true;
  }, [editorRef]);

  const canUndo = useSyncExternalStore(
    subscribeToEditorState,
    () => (editorRef.current?.history.undos.length ?? 0) > 0,
  );

  const canRedo = useSyncExternalStore(
    subscribeToEditorState,
    () => (editorRef.current?.history.redos.length ?? 0) > 0,
  );

  return {
    loadFile,
    loadBytes,
    serialize,
    undo,
    redo,
    canUndo,
    canRedo,
    editorReady: true,
  };
}
