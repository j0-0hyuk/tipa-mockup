import { useCallback, useRef } from "react";
import styled from "@emotion/styled";
import { Button, Flex, Menu, MenuTrigger, MenuContent, MenuItem } from "@bichon/ds";
import { useToolbarActions } from "../toolbar/use-toolbar-actions";
import { useParagraphStyle } from "../toolbar/use-paragraph-style";
import { downloadBytes } from "../utils/download";

const HiddenInput = styled.input`
  display: none;
`;

export interface ToolbarProps {
  /** Called when the document style (T) button is clicked. */
  onStyleClick?: () => void;
}

export function Toolbar({ onStyleClick }: ToolbarProps = {}) {
  const { loadFile, serialize, undo, redo, canUndo, canRedo } =
    useToolbarActions();
  const { currentStyleKey, options, setStyle } = useParagraphStyle();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileOpen = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) loadFile(file);
    },
    [loadFile],
  );

  const handleSave = useCallback(() => {
    const bytes = serialize();
    downloadBytes(bytes, "document.hwpx");
  }, [serialize]);

  const currentLabel =
    options.find((o) => o.styleKey === currentStyleKey)?.displayName ?? "스타일";

  return (
    <Flex gap={8} alignItems="center">
      <Button
        variant="outlined"
        size="small"
        onClick={() => fileInputRef.current?.click()}
      >
        열기
      </Button>
      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept=".hwpx"
        onChange={handleFileOpen}
      />
      <Button variant="outlined" size="small" onClick={handleSave}>
        저장
      </Button>
      {options.length > 0 && (
        <Menu>
          <MenuTrigger asChild>
            <Button variant="outlined" size="small">
              {currentLabel}
            </Button>
          </MenuTrigger>
          <MenuContent>
            {options.map((opt) => (
              <MenuItem key={opt.styleKey} onSelect={() => setStyle(opt.styleKey)}>
                <span style={opt.cssStyle}>{opt.mark ? `${opt.mark} ` : ""}{opt.displayName}</span>
              </MenuItem>
            ))}
          </MenuContent>
        </Menu>
      )}
      {onStyleClick && (
        <Button variant="outlined" size="small" onClick={onStyleClick}>
          T
        </Button>
      )}
      <Button
        variant="outlined"
        size="small"
        onClick={undo}
        disabled={!canUndo}
      >
        실행 취소
      </Button>
      <Button
        variant="outlined"
        size="small"
        onClick={redo}
        disabled={!canRedo}
      >
        다시 실행
      </Button>
    </Flex>
  );
}
