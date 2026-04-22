import type { DocshuntUIMessage } from '@/ai/ui-message';
import { Flex, Spinner } from '@docs-front/ui';
import type { TextUIPart } from 'ai';
import { Streamdown } from 'streamdown';
import { StyledUserText } from '@/ai/components/parts/TextPart/TextPart.style';

interface TextPartProps {
  part: TextUIPart;
  message: DocshuntUIMessage;
}

export const TextPart = ({ part, message }: TextPartProps) => {
  return (
    <Flex justify={message.role === 'user' ? 'flex-end' : 'flex-start'}>
      <Flex
        direction="column"
        $borderColor={message.role === 'user' ? 'borderGray' : 'none'}
        padding={message.role === 'user' ? 12 : 0}
        $borderRadius="lg"
        $typo="Rg_16"
        $bgColor={message.role === 'user' ? 'white' : 'none'}
      >
        {part.state === 'streaming' &&
          message.role === 'assistant' &&
          part.text.length === 0 && <Spinner size={20} />}
        {message.role === 'assistant' && <Streamdown>{part.text}</Streamdown>}
        {message.role === 'user' && (
          <StyledUserText>{part.text}</StyledUserText>
        )}
      </Flex>
    </Flex>
  );
};
