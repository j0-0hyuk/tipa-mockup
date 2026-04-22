import { Flex, Spinner } from '@docs-front/ui';
import { CheckCheck } from 'lucide-react';
import { TOOL_LABELS } from '@/routes/_authenticated/d/-components/DocumentChatSection/DocumentChatToolPart/DocumentChatToolPart.constants';

interface DocumentChatToolPartProps {
  toolName: string;
  isDone: boolean;
  isChatActive: boolean;
}

export function DocumentChatToolPart({
  toolName,
  isDone,
  isChatActive
}: DocumentChatToolPartProps) {
  const toolLabel = TOOL_LABELS[toolName];
  if (!toolLabel) return null;

  return (
    <Flex alignItems="center" $typo="Md_16" $color="main" gap={8}>
      {isDone ? (
        <>
          <CheckCheck size={20} />
          <span>{toolLabel.done}</span>
        </>
      ) : isChatActive ? (
        <>
          <Spinner size={20} />
          <span>{toolLabel.loading}</span>
        </>
      ) : (
        <Flex $color="textGray">도구 중단됨</Flex>
      )}
    </Flex>
  );
}
