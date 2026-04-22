import {
  Flex,
  Checkbox,
  TextField,
  TableRoot,
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableBodyRow,
  TableBodyCell
} from '@bichon/ds';
import { Plus, X } from 'lucide-react';
import {
  StyledTitleCell,
  StyledHeaderText,
  StyledAddButton,
  StyledDeleteButton,
  StyledTableContainer,
  StyledPromptCellWrapper
} from '@/routes/_authenticated/f/visual-suggestions/-index.style';

export interface VisualSuggestion {
  id: string;
  title: string;
  prompt: string;
  position: string;
  genBy: 'ai' | 'human';
  selected: boolean;
}

interface SuggestionsTableProps {
  suggestions: VisualSuggestion[];
  selectedCount: number;
  maxSuggestions: number;
  onToggle: (id: string) => void;
  onTitleChange: (id: string, title: string) => void;
  onPromptChange: (id: string, prompt: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function SuggestionsTable({
  suggestions,
  selectedCount,
  maxSuggestions,
  onToggle,
  onTitleChange,
  onPromptChange,
  onDelete,
  onAdd
}: SuggestionsTableProps) {
  return (
    <Flex direction="column" gap={16} width="100%">
      <StyledTableContainer>
        <TableRoot>
          <Table>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell style={{ width: '6%' }}>
                  <StyledHeaderText>선택</StyledHeaderText>
                </TableHeaderCell>
                <TableHeaderCell style={{ width: '20%' }}>
                  <StyledHeaderText>이미지 제목</StyledHeaderText>
                </TableHeaderCell>
                <TableHeaderCell style={{ width: '70%' }}>
                  <StyledHeaderText>
                    생성 프롬프트 (AI에게 내리는 명령)
                  </StyledHeaderText>
                </TableHeaderCell>
                <TableHeaderCell style={{ width: '4%' }} />
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {suggestions.map((suggestion) => (
                <TableBodyRow key={suggestion.id}>
                  <TableBodyCell
                    style={{
                      textAlign: 'center',
                      verticalAlign: 'middle'
                    }}
                  >
                    <Checkbox
                      checked={suggestion.selected}
                      disabled={
                        !suggestion.selected &&
                        selectedCount >= maxSuggestions
                      }
                      onCheckedChange={() => onToggle(suggestion.id)}
                      aria-label={`${suggestion.title} 선택`}
                    />
                  </TableBodyCell>
                  <TableBodyCell style={{ verticalAlign: 'middle' }}>
                    {suggestion.genBy === 'ai' ? (
                      <StyledTitleCell $selected={suggestion.selected}>
                        {suggestion.title}
                      </StyledTitleCell>
                    ) : (
                      <TextField
                        value={suggestion.title}
                        onChange={(e) =>
                          onTitleChange(
                            suggestion.id,
                            (e.target as HTMLInputElement).value
                          )
                        }
                        placeholder="이미지 제목 입력"
                        width="100%"
                        aria-label="이미지 제목"
                      />
                    )}
                  </TableBodyCell>
                  <TableBodyCell style={{ verticalAlign: 'middle' }}>
                    <StyledPromptCellWrapper $selected={suggestion.selected}>
                      <TextField
                        multiline
                        minRows={1}
                        maxRows={6}
                        value={suggestion.prompt}
                        onChange={(e) =>
                          onPromptChange(
                            suggestion.id,
                            (e.target as HTMLTextAreaElement).value
                          )
                        }
                        placeholder="생성 프롬프트를 입력하세요"
                        width="100%"
                        aria-label={`${suggestion.title} 생성 프롬프트`}
                      />
                    </StyledPromptCellWrapper>
                  </TableBodyCell>
                  <TableBodyCell
                    style={{
                      textAlign: 'center',
                      verticalAlign: 'middle'
                    }}
                  >
                    <StyledDeleteButton
                      type="button"
                      onClick={() => onDelete(suggestion.id)}
                      aria-label={`${suggestion.title} 삭제`}
                    >
                      <X size={16} />
                    </StyledDeleteButton>
                  </TableBodyCell>
                </TableBodyRow>
              ))}
            </TableBody>
          </Table>
        </TableRoot>
      </StyledTableContainer>

      <StyledAddButton type="button" onClick={onAdd}>
        <Plus size={16} />
        새로운 이미지 항목 추가
      </StyledAddButton>
    </Flex>
  );
}
