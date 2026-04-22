import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
  type MutableRefObject,
} from "react";
import type { Descendant } from "slate";
import { DocumentStore, type PageProperties } from "../store/document-store";
import { irToSlateNodes } from "../store/ir-converter";
import { StyleResolver, type Theme } from "../style";
import { ActionDispatcher } from "../action/dispatcher";
import type { HwpxEditor, ParagraphElement } from "../schema";

interface EditorContextValue {
  store: DocumentStore;
  styleResolver: StyleResolver | null;
  pageProperties: PageProperties | null;
  value: Descendant[];
  setValue: (value: Descendant[]) => void;
  /** 문서 로드 횟수. SlateEditor의 key로 사용하여 리마운트 트리거. */
  loadCount: number;
  loadFile: (file: File) => Promise<void>;
  loadBytes: (data: Uint8Array, filename: string) => Promise<void>;
  refreshStyles: () => void;
  subscribeToEditorState: (listener: () => void) => () => void;
  notifyEditorStateChange: () => void;
  editorRef: MutableRefObject<HwpxEditor | null>;
  dispatcher: ActionDispatcher;
  /** WASM IR에서 Slate 트리를 다시 로드한다. diff accept/reject 등에서 사용. */
  reloadEditor: () => void;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function useEditor(): EditorContextValue {
  const ctx = useContext(EditorContext);
  if (!ctx) {
    throw new Error("useEditor must be used within <EditorProvider>");
  }
  return ctx;
}

export interface EditorProviderProps {
  children: ReactNode;
  store?: DocumentStore;
  /** 문서 로드 직후, onChange 리스너 등록 전에 적용할 초기 테마 */
  initialTheme?: Theme;
  onLoad?: (store: DocumentStore) => void;
  onChange?: (store: DocumentStore) => void;
  onError?: (error: Error) => void;
}

const INITIAL_VALUE: Descendant[] = [
  {
    type: "paragraph" as const,
    style: null,
    refId: null,
    children: [
      {
        type: "run" as const,
        style: null,
        refId: null,
        children: [{ type: "t" as const, children: [{ text: "" }] }],
      },
    ],
  },
];

export function EditorProvider({
  children,
  store: externalStore,
  initialTheme,
  onLoad,
  onChange,
  onError,
}: EditorProviderProps) {
  const [internalStore] = useState(() => externalStore ?? new DocumentStore());
  const store = externalStore ?? internalStore;

  const editorRef = useRef<HwpxEditor | null>(null);
  const [dispatcher] = useState(() => new ActionDispatcher(store));
  const stateListenersRef = useRef(new Set<() => void>());

  const subscribeToEditorState = useCallback((listener: () => void) => {
    stateListenersRef.current.add(listener);
    return () => {
      stateListenersRef.current.delete(listener);
    };
  }, []);

  const notifyEditorStateChange = useCallback(() => {
    stateListenersRef.current.forEach((l) => l());
  }, []);

  const [styleResolver, setStyleResolver] = useState<StyleResolver | null>(
    null,
  );
  const [pageProperties, setPageProperties] = useState<PageProperties | null>(
    null,
  );
  const [value, setValue] = useState<Descendant[]>(INITIAL_VALUE);
  const [loadCount, setLoadCount] = useState(0);

  useEffect(() => {
    if (!onChange) return;
    return store.onStoreChange(onChange);
  }, [store, onChange]);

  // Cleanup: dispatcher + store dispose + style element removal on unmount
  useEffect(() => {
    return () => {
      dispatcher.dispose();
      store.dispose();
      document.getElementById("hwpx-theme-styles")?.remove();
    };
  }, [store, dispatcher]);

  const doLoad = useCallback(
    (data: Uint8Array, filename: string) => {
      dispatcher.cancelPending();
      store.load(data, filename);

      if (initialTheme) {
        store.setThemeSilent(initialTheme);
      }

      const theme = store.getTheme();
      const resolver = new StyleResolver(theme);
      setStyleResolver(resolver);

      let styleEl = document.getElementById("hwpx-theme-styles");
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "hwpx-theme-styles";
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = resolver.toCssText();

      setPageProperties(store.getPageProperties());

      const ir = store.getIr();
      const nodes = irToSlateNodes(ir, store);
      dispatcher.snapshot(nodes as ParagraphElement[]);
      setValue(nodes);
      setLoadCount((c) => c + 1);

      onLoad?.(store);
    },
    [store, dispatcher, initialTheme, onLoad],
  );

  const reloadEditor = useCallback(() => {
    dispatcher.cancelPending();
    const ir = store.getIr();
    const nodes = irToSlateNodes(ir, store);
    dispatcher.snapshot(nodes as ParagraphElement[]);
    setValue(nodes);
    setLoadCount((c) => c + 1);
  }, [store, dispatcher]);

  const refreshStyles = useCallback(() => {
    const theme = store.getTheme();
    const resolver = new StyleResolver(theme);
    setStyleResolver(resolver);

    const styleEl = document.getElementById("hwpx-theme-styles");
    if (styleEl) {
      styleEl.textContent = resolver.toCssText();
    }
  }, [store]);

  const loadFile = useCallback(
    async (file: File) => {
      try {
        const bytes = new Uint8Array(await file.arrayBuffer());
        doLoad(bytes, file.name);
      } catch (err) {
        onError?.(err instanceof Error ? err : new Error(String(err)));
      }
    },
    [doLoad, onError],
  );

  const loadBytes = useCallback(
    async (data: Uint8Array, filename: string) => {
      try {
        doLoad(data, filename);
      } catch (err) {
        onError?.(err instanceof Error ? err : new Error(String(err)));
      }
    },
    [doLoad, onError],
  );

  return (
    <EditorContext.Provider
      value={{
        store,
        styleResolver,
        pageProperties,
        value,
        setValue,
        loadCount,
        loadFile,
        loadBytes,
        refreshStyles,
        subscribeToEditorState,
        notifyEditorStateChange,
        editorRef,
        dispatcher,
        reloadEditor,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}
