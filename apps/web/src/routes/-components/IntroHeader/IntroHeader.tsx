import { StyledIntroHeader } from '@/routes/-components/IntroHeader/IntroHeader.style';
import { StyledLine } from '@/routes/-components/IntroHeader/IntroHeader.style';
import { Globe } from 'lucide-react';
import { Flex, Select, DocshuntIcon } from '@docs-front/ui';
import { useI18n } from '@/hooks/useI18n.ts';

export const IntroHeader = () => {
  const { options, onChangeLanguageForGuest, currentLanguage } = useI18n([
    'language'
  ]);

  return (
    <StyledIntroHeader>
      <DocshuntIcon />
      <StyledLine />
      <Flex>
        <Select
          leftIcon={<Globe size={16} />}
          defaultValue={currentLanguage}
          iconSize={16}
          padding="6px 8px"
          $typo="Md_13"
          height="36px"
          $borderColor="borderGray"
          $borderRadius="md"
          $color="black"
          onChange={onChangeLanguageForGuest}
        >
          {options.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select>
      </Flex>
    </StyledIntroHeader>
  );
};
