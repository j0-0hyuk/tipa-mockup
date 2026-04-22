import { useParagraphStyle } from '@docs-front/hwpx-editor/headless';
import { Menu, MenuTrigger, MenuContent, MenuItem } from '@bichon/ds';
import { ChevronDown } from 'lucide-react';
import {
  StyledDropdownTrigger,
  StyledOptionButton
} from '@/routes/_authenticated/d/-components/DocumentPanel/components/ParagraphStyleDropdown/ParagraphStyleDropdown.style';

export function ParagraphStyleDropdown() {
  const { currentStyleKey, options, setStyle } = useParagraphStyle();

  const currentLabel =
    options.find((o) => o.styleKey === currentStyleKey)?.displayName ?? '혼합';

  return (
    <Menu>
      <MenuTrigger asChild>
        <StyledDropdownTrigger type="button">
          <span>{currentLabel}</span>
          <ChevronDown size={14} />
        </StyledDropdownTrigger>
      </MenuTrigger>
      <MenuContent
        align="start"
        sideOffset={4}
        style={{ minWidth: 160, maxHeight: 300, overflowY: 'auto' }}
      >
        {options.map((opt) => (
          <MenuItem key={opt.styleKey} onSelect={() => setStyle(opt.styleKey)}>
            <StyledOptionButton
              $active={opt.styleKey === currentStyleKey}
              style={{
                ...opt.cssStyle,
                fontSize: Math.min(
                  Number(
                    opt.cssStyle?.fontSize?.toString().replace('px', '')
                  ) || 14,
                  18
                )
              }}
            >
              {opt.mark ? `${opt.mark} ` : ''}
              {opt.displayName}
            </StyledOptionButton>
          </MenuItem>
        ))}
      </MenuContent>
    </Menu>
  );
}
