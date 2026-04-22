import {
  StyledLauncherWrap,
  StyledLauncherButton,
  StyledLauncherRing,
  StyledLauncherLogoBadge,
  StyledLauncherText,
  StyledLauncherTitle,
  StyledLauncherName,
  StyledLauncherNameSub,
  StyledLauncherTagline,
  StyledLauncherHint,
} from './styles';
import { BOT_TAGLINE } from './script';
import { TipaLogo } from './TipaLogo';

interface ChatbotLauncherProps {
  exiting: boolean;
  onStart: () => void;
}

export function ChatbotLauncher({ exiting, onStart }: ChatbotLauncherProps) {
  return (
    <StyledLauncherWrap $exiting={exiting}>
      <StyledLauncherText>
        <StyledLauncherTitle>
          <StyledLauncherName>
            <span>TIPA</span><StyledLauncherNameSub>NI</StyledLauncherNameSub>
          </StyledLauncherName>
          <StyledLauncherTagline>{BOT_TAGLINE}</StyledLauncherTagline>
        </StyledLauncherTitle>
        <StyledLauncherHint>오른쪽 아이콘을 누르면 대화가 시작돼요</StyledLauncherHint>
      </StyledLauncherText>
      <StyledLauncherButton onClick={onStart} aria-label="챗봇 대화 시작">
        <StyledLauncherRing $delay={0} />
        <StyledLauncherLogoBadge>
          <TipaLogo />
        </StyledLauncherLogoBadge>
      </StyledLauncherButton>
    </StyledLauncherWrap>
  );
}
