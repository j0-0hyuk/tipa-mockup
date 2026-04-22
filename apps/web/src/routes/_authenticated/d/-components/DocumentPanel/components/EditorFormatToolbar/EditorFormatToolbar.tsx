import {
  useToolbarActions,
  useParagraphStyle,
  useInlineParagraphStyle
} from '@docs-front/hwpx-editor/headless';
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  IconButton
} from '@bichon/ds';
import { Tooltip } from '@docs-front/ui';
import {
  ChevronDown,
  Undo2,
  Redo2,
  Type,
  RotateCcw,
  Download,
  Bold,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react';
import {
  FONT_SIZES,
  FONT_FACES,
  LINE_SPACINGS,
  MARK_OPTIONS,
  PARAGRAPH_SPACINGS
} from '@/components/DocsThemeDialog/DocsThemeDialog.constant';
import {
  StyledFormatToolbar,
  StyledToolbarDivider,
  StyledStyleTrigger
} from '@/routes/_authenticated/d/-components/DocumentPanel/components/EditorFormatToolbar/EditorFormatToolbar.style';

interface EditorFormatToolbarProps {
  onOpenStyleDialog: () => void;
  onReset?: () => void;
  onDownload?: () => void;
}

export function EditorFormatToolbar({
  onOpenStyleDialog,
  onReset,
  onDownload
}: EditorFormatToolbarProps) {
  const { canUndo, canRedo, undo, redo } = useToolbarActions();
  const { currentStyleKey, options, setStyle } = useParagraphStyle();
  const { values, setParagraphProperty, setCharacterProperty } =
    useInlineParagraphStyle();

  const currentLabel =
    options.find((o) => o.styleKey === currentStyleKey)?.displayName ?? '스타일';

  const currentMark =
    typeof values.mark === 'string' ? values.mark : undefined;
  const currentFontFace = values.fontFace?.[0] ?? '맑은 고딕';

  return (
    <StyledFormatToolbar>
      {/* 스타일 선택 드롭다운 */}
      <Menu>
        <Tooltip content="스타일" side="bottom">
          <MenuTrigger asChild>
            <StyledStyleTrigger type="button">
              <span>{currentLabel}</span>
              <ChevronDown size={14} />
            </StyledStyleTrigger>
          </MenuTrigger>
        </Tooltip>
        <MenuContent
          align="start"
          sideOffset={4}
          style={{ minWidth: 160, maxHeight: 300, overflowY: 'auto' }}
        >
          {options.map((opt) => (
            <MenuItem
              key={opt.styleKey}
              onSelect={() => setStyle(opt.styleKey)}
            >
              <span
                style={{
                  ...opt.cssStyle,
                  fontSize: Math.min(
                    Number(
                      opt.cssStyle?.fontSize?.toString().replace('px', '')
                    ) || 14,
                    16
                  )
                }}
              >
                {opt.mark ? `${opt.mark} ` : ''}
                {opt.displayName}
              </span>
            </MenuItem>
          ))}
        </MenuContent>
      </Menu>

      <StyledToolbarDivider />

      {/* 글꼴 드롭다운 */}
      <Menu>
        <Tooltip content="글꼴" side="bottom">
          <MenuTrigger asChild>
            <StyledStyleTrigger type="button" style={{ maxWidth: 120 }}>
              <span
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {currentFontFace}
              </span>
              <ChevronDown size={14} />
            </StyledStyleTrigger>
          </MenuTrigger>
        </Tooltip>
        <MenuContent
          align="start"
          sideOffset={4}
          style={{ maxHeight: 300, overflowY: 'auto' }}
        >
          {/* 현재 글꼴이 기본 목록에 없으면 상단에 표시 */}
          {currentFontFace &&
            !FONT_FACES.includes(
              currentFontFace as (typeof FONT_FACES)[number]
            ) && (
              <MenuItem
                key={currentFontFace}
                onSelect={() =>
                  setCharacterProperty('face', [currentFontFace])
                }
              >
                {currentFontFace}
              </MenuItem>
            )}
          {FONT_FACES.map((f) => (
            <MenuItem
              key={f}
              onSelect={() => setCharacterProperty('face', [f])}
            >
              {f}
            </MenuItem>
          ))}
        </MenuContent>
      </Menu>

      {/* 글꼴 크기 드롭다운 */}
      <Menu>
        <Tooltip content="글꼴 크기" side="bottom">
          <MenuTrigger asChild>
            <StyledStyleTrigger type="button">
              <span>{values.fontSize ?? 12}pt</span>
              <ChevronDown size={14} />
            </StyledStyleTrigger>
          </MenuTrigger>
        </Tooltip>
        <MenuContent
          align="start"
          sideOffset={4}
          style={{ maxHeight: 300, overflowY: 'auto' }}
        >
          {FONT_SIZES.map((s) => (
            <MenuItem
              key={s}
              onSelect={() => setCharacterProperty('size', s)}
            >
              {s}pt
            </MenuItem>
          ))}
        </MenuContent>
      </Menu>

      <StyledToolbarDivider />

      {/* 굵게 */}
      <Tooltip content="굵게" side="bottom">
        <IconButton
          variant={values.bold ? 'filled' : 'text'}
          size="small"
          onClick={() => setCharacterProperty('bold', !values.bold)}
        >
          <Bold size={16} />
        </IconButton>
      </Tooltip>

      <StyledToolbarDivider />

      {/* 정렬 */}
      <Tooltip content="왼쪽 정렬" side="bottom">
        <IconButton
          variant={values.align === 'left' || !values.align ? 'filled' : 'text'}
          size="small"
          onClick={() => setParagraphProperty('align', 'left')}
        >
          <AlignLeft size={16} />
        </IconButton>
      </Tooltip>
      <Tooltip content="가운데 정렬" side="bottom">
        <IconButton
          variant={values.align === 'center' ? 'filled' : 'text'}
          size="small"
          onClick={() => setParagraphProperty('align', 'center')}
        >
          <AlignCenter size={16} />
        </IconButton>
      </Tooltip>
      <Tooltip content="오른쪽 정렬" side="bottom">
        <IconButton
          variant={values.align === 'right' ? 'filled' : 'text'}
          size="small"
          onClick={() => setParagraphProperty('align', 'right')}
        >
          <AlignRight size={16} />
        </IconButton>
      </Tooltip>
      <Tooltip content="양쪽 정렬" side="bottom">
        <IconButton
          variant={values.align === 'justify' ? 'filled' : 'text'}
          size="small"
          onClick={() => setParagraphProperty('align', 'justify')}
        >
          <AlignJustify size={16} />
        </IconButton>
      </Tooltip>

      <StyledToolbarDivider />

      {/* 줄간격 드롭다운 */}
      <Menu>
        <Tooltip content="줄간격" side="bottom">
          <MenuTrigger asChild>
            <StyledStyleTrigger type="button">
              <span>{values.lineSpacing ?? 160}%</span>
              <ChevronDown size={14} />
            </StyledStyleTrigger>
          </MenuTrigger>
        </Tooltip>
        <MenuContent
          align="start"
          sideOffset={4}
          style={{ maxHeight: 300, overflowY: 'auto' }}
        >
          {LINE_SPACINGS.map((s) => (
            <MenuItem
              key={s}
              onSelect={() => setParagraphProperty('line_spacing', s)}
            >
              {s}%
            </MenuItem>
          ))}
        </MenuContent>
      </Menu>

      {/* 글머리 기호 드롭다운 */}
      <Menu>
        <Tooltip content="글머리 기호" side="bottom">
          <MenuTrigger asChild>
            <StyledStyleTrigger type="button">
              <span>{currentMark ?? '없음'}</span>
              <ChevronDown size={14} />
            </StyledStyleTrigger>
          </MenuTrigger>
        </Tooltip>
        <MenuContent
          align="start"
          sideOffset={4}
          style={{ maxHeight: 300, overflowY: 'auto' }}
        >
          {MARK_OPTIONS.map((m) => (
            <MenuItem
              key={m ?? '__none'}
              onSelect={() => setParagraphProperty('mark', m)}
            >
              {m ?? '없음'}
            </MenuItem>
          ))}
        </MenuContent>
      </Menu>

      {/* 문단 위 간격 드롭다운 */}
      <Menu>
        <Tooltip content="문단 위 간격" side="bottom">
          <MenuTrigger asChild>
            <StyledStyleTrigger type="button">
              <span>↑ {values.marginTop ?? 0}pt</span>
              <ChevronDown size={14} />
            </StyledStyleTrigger>
          </MenuTrigger>
        </Tooltip>
        <MenuContent
          align="start"
          sideOffset={4}
          style={{ maxHeight: 300, overflowY: 'auto' }}
        >
          {PARAGRAPH_SPACINGS.map((s) => (
            <MenuItem
              key={s}
              onSelect={() => setParagraphProperty('margin_top', s)}
            >
              {s}pt
            </MenuItem>
          ))}
        </MenuContent>
      </Menu>

      {/* 문단 아래 간격 드롭다운 */}
      <Menu>
        <Tooltip content="문단 아래 간격" side="bottom">
          <MenuTrigger asChild>
            <StyledStyleTrigger type="button">
              <span>↓ {values.marginBottom ?? 0}pt</span>
              <ChevronDown size={14} />
            </StyledStyleTrigger>
          </MenuTrigger>
        </Tooltip>
        <MenuContent
          align="start"
          sideOffset={4}
          style={{ maxHeight: 300, overflowY: 'auto' }}
        >
          {PARAGRAPH_SPACINGS.map((s) => (
            <MenuItem
              key={s}
              onSelect={() => setParagraphProperty('margin_bottom', s)}
            >
              {s}pt
            </MenuItem>
          ))}
        </MenuContent>
      </Menu>

      <StyledToolbarDivider />

      {/* Undo / Redo */}
      <Tooltip content="실행 취소" side="bottom">
        <IconButton
          variant="text"
          size="small"
          disabled={!canUndo}
          onClick={() => canUndo && undo()}
        >
          <Undo2 size={16} />
        </IconButton>
      </Tooltip>
      <Tooltip content="다시 실행" side="bottom">
        <IconButton
          variant="text"
          size="small"
          disabled={!canRedo}
          onClick={() => canRedo && redo()}
        >
          <Redo2 size={16} />
        </IconButton>
      </Tooltip>

      <StyledToolbarDivider />

      {/* 문서 스타일 다이얼로그 */}
      <Tooltip content="문서 스타일" side="bottom">
        <IconButton variant="text" size="small" onClick={onOpenStyleDialog}>
          <Type size={16} />
        </IconButton>
      </Tooltip>

      {(onReset || onDownload) && <StyledToolbarDivider />}

      {onReset && (
        <Tooltip content="처음으로 되돌리기" side="bottom">
          <IconButton variant="text" size="small" onClick={onReset}>
            <RotateCcw size={16} />
          </IconButton>
        </Tooltip>
      )}
      {onDownload && (
        <Tooltip content="다운로드" side="bottom">
          <IconButton variant="filled" size="small" onClick={onDownload}>
            <Download size={16} />
          </IconButton>
        </Tooltip>
      )}
    </StyledFormatToolbar>
  );
}
