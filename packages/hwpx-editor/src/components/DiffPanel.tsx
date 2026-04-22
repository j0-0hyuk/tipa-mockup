import { useMemo, type ReactNode } from "react";
import styled from "@emotion/styled";
import { Button, Badge, Checkbox, Flex, colors, radius } from "@bichon/ds";
import type { DiffSession } from "../diff/use-diff-session";
import { computeDiff, type DiffSegment } from "../diff/compute-diff";

/* ── 배지 variant 맵 ── */
const BADGE_VARIANT: Record<string, "active" | "neutral" | "warning"> = {
  update: "active",
  add: "active",
  delete: "warning",
};

/* ── Styled Components ── */

const SegAdd = styled.span`
  background: ${colors.bgAccentSubtle};
  color: ${colors.textAccent};
  border-radius: ${radius.xs};
`;

const SegRemove = styled.span`
  background: ${colors.bgWarningSubtle};
  color: ${colors.bgWarningDark};
  text-decoration: line-through;
  border-radius: ${radius.xs};
`;

const EmptyText = styled.span`
  color: ${colors.textDisabled};
  font-style: italic;
`;

const Pane = styled.div`
  padding: 8px 14px;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.6;
  min-height: 32px;
  overflow-x: auto;
`;

const PaneLeft = styled(Pane)`
  border-right: 1px solid ${colors.lineDefault};
`;

const PanelWrapper = styled.div`
  border: 1px solid ${colors.lineDefault};
  border-radius: ${radius.lg};
  background: ${colors.bgWhite};
  font-size: 14px;
  overflow: hidden;
`;

const HeaderBar = styled(Flex)`
  padding: 10px 14px;
  border-bottom: 1px solid ${colors.lineDefault};
  background: ${colors.bgLightGrey};
`;

const EntryWrapper = styled.div`
  border-bottom: 1px solid ${colors.lineDefault};
`;

const EntryHeader = styled(Flex)`
  padding: 8px 14px;
  background: ${colors.bgLightGrey};
`;

const EntryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const PositionLabel = styled.span`
  color: ${colors.textTertiary};
  font-size: 12px;
`;

const HeaderTitle = styled.span`
  font-weight: 600;
  font-size: 14px;
`;

const HeaderCount = styled.span`
  font-weight: 400;
  color: ${colors.textTertiary};
  margin-left: 8px;
`;

const StreamingIndicator = styled.div`
  padding: 10px 14px;
  color: ${colors.textDisabled};
  font-size: 12px;
  text-align: center;
`;

/* ── Diff Segment 렌더링 ── */
function renderSegments(segments: DiffSegment[], side: "left" | "right"): ReactNode[] {
  return segments
    .filter((seg) => {
      if (side === "left") return seg.type !== "add";
      return seg.type !== "remove";
    })
    .map((seg, i) => {
      if (seg.type === "equal") {
        return <span key={i}>{seg.text}</span>;
      }
      const Seg = seg.type === "add" ? SegAdd : SegRemove;
      return <Seg key={i}>{seg.text}</Seg>;
    });
}

/* ── DiffEntry 카드 ── */
function DiffEntryCard({
  entry,
  index,
  onToggle,
}: {
  entry: DiffSession["entries"][number];
  index: number;
  onToggle: (i: number) => void;
}) {
  const { action, oldXml, newXml, checked } = entry;

  const segments = useMemo(() => {
    if (action.type === "update" && oldXml && newXml) {
      return computeDiff(oldXml, newXml);
    }
    return null;
  }, [action.type, oldXml, newXml]);

  const positionLabel =
    action.type === "add" && "position" in action
      ? ` ${action.position} ${action.refId}`
      : ` ${action.refId}`;

  return (
    <EntryWrapper>
      <EntryHeader gap={8} alignItems="center">
        <Checkbox
          checked={checked}
          onCheckedChange={() => onToggle(index)}
        />
        <Badge
          variant={BADGE_VARIANT[action.type] ?? "active"}
          size="small"
        >
          {action.type}
        </Badge>
        <PositionLabel>{positionLabel}</PositionLabel>
      </EntryHeader>
      <EntryGrid>
        {/* Left: Current */}
        <PaneLeft>
          {action.type === "add" ? (
            <EmptyText>(없음)</EmptyText>
          ) : segments ? (
            renderSegments(segments, "left")
          ) : (
            oldXml ?? <EmptyText>(없음)</EmptyText>
          )}
        </PaneLeft>
        {/* Right: Proposed */}
        <Pane>
          {action.type === "delete" ? (
            <EmptyText>(삭제됨)</EmptyText>
          ) : segments ? (
            renderSegments(segments, "right")
          ) : (
            newXml ?? <EmptyText>(없음)</EmptyText>
          )}
        </Pane>
      </EntryGrid>
    </EntryWrapper>
  );
}

/* ── DiffPanel ── */
export interface DiffPanelProps {
  session: DiffSession;
}

export function DiffPanel({ session }: DiffPanelProps) {
  const {
    entries,
    status,
    toggleEntry,
    toggleAll,
    applyChecked,
    reset,
  } = session;

  if (status === "idle" && entries.length === 0) return null;

  const allChecked = entries.length > 0 && entries.every((e) => e.checked);
  const checkedCount = entries.filter((e) => e.checked).length;

  return (
    <PanelWrapper>
      {/* Header */}
      <HeaderBar justify="space-between" alignItems="center">
        <HeaderTitle>
          AI 변경 검토
          {entries.length > 0 && (
            <HeaderCount>
              {checkedCount}/{entries.length} 선택됨
            </HeaderCount>
          )}
        </HeaderTitle>
        <Flex gap={6} alignItems="center">
          <Button
            variant="outlined"
            size="small"
            onClick={() => toggleAll(!allChecked)}
          >
            {allChecked ? "전체 해제" : "전체 선택"}
          </Button>
          <Button
            variant="filled"
            size="small"
            onClick={applyChecked}
            disabled={checkedCount === 0 || status === "streaming"}
          >
            적용 ({checkedCount})
          </Button>
          <Button variant="text" size="small" onClick={reset}>
            닫기
          </Button>
        </Flex>
      </HeaderBar>

      {/* Entries */}
      {entries.map((entry, i) => (
        <DiffEntryCard
          key={i}
          entry={entry}
          index={i}
          onToggle={toggleEntry}
        />
      ))}

      {/* Streaming indicator */}
      {status === "streaming" && (
        <StreamingIndicator>변경사항 수신 중...</StreamingIndicator>
      )}
    </PanelWrapper>
  );
}
