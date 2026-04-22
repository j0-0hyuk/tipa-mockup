import { Flex, Spinner } from '@docs-front/ui';
import type { TextUIPart } from 'ai';
import { Streamdown } from 'streamdown';

interface DocumentChatTextPartProps {
  part: TextUIPart;
}

export function DocumentChatTextPart({ part }: DocumentChatTextPartProps) {
  if (part.state === 'streaming' && part.text.length === 0) {
    return <Spinner size={20} />;
  }

  return (
    <Flex direction="column" $borderRadius="lg" $typo="Rg_16">
      <Streamdown>{part.text}</Streamdown>
    </Flex>
  );
}
